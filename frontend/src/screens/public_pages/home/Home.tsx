
import useSignOut from '@/utils/useSignOut';
import Image from 'next/image';
import StreamerImage from '../../../assets/Streamer.png';
import ProfileDisplay from '@/components/ProfileDisplay';
import TransactionsList from '@/components/TransactionsList';
import CheckoutPopup from '@/components/StripePopUp';
import WithAuthMiddleware from '@/components/guards/withAuth';
import '../../../global_styles/index.css';
import { PiMicrophone, PiMicrophoneSlash, PiVideoCameraLight, PiVideoCameraSlash } from "react-icons/pi";
import { Button } from '@/components';
import { MdLiveTv } from "react-icons/md";
import CheckoutForm from '@/screens/payments/CheckoutForm';
import { useEffect, useRef, useState } from 'react';
import { ICheckoutData } from '@/interfaces/payments';
import * as apiServer from '@/services/api.server';
import TransferCredit from './TransferCredit';
import notification from '@/utils/notification';
import {
  broadcastMessage,
  createAgoraClient,
  createLocalTrack,
  joinBroadCastInit,
  publishTrack,
  registerEvent,
  registerMessagingEvent,
  subScribeUser,
  updateBroadcastMemberDetails,
} from '@/utils/agoraManager';
import AgoraRTC, {
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';
import {
  handleAddLocalUserToView,
  handleBroadcastingChannelMessaging,
  leaveBroadcastChannel,
  sendMessage,
} from '@/utils/dom';
import classNames from 'classnames';
import { Loader } from '@/components/loader/Loader';
import Footer from '@/layouts/footer/Footer';
import { FaRegCirclePlay } from 'react-icons/fa6';

let agClient = undefined;

const Home = () => {
  // Streaming States
  const messageContentRef = useRef(null);
  const broadcasterRef = useRef(null);

  const [currentStreamer, setCurrentStreamer] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('');
  const [message, setMessage] = useState('');

  const [isOnline, setIsOnline] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [enable, setEnable] = useState(false);

  const [liveSessionUsers, setLiveSessionUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  //Users States
  const [userDashboardInformation, setUserDashboardInformation] = useState<any>(
    {}
  );
  const [platformUsers, setPlatformUsers] = useState([]);
  //Payments States
  const [isGettingCredit, setIsGettingCredit] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [openTransferCredit, setOpenTransferCredit] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [checkoutData, setCheckoutData] = useState<ICheckoutData>({
    amount: 0,
    currency: '',
  });
  const [cameraMuted, setCameraMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);


  const signUserOut = useSignOut();

  const updateOnlineStatus = async (value: boolean) => {
    try {
      await apiServer.updateOnlineStatus({
        islive: value,
      });
    } catch (error) { }
  };

  const handleOpenCheckout = (checkoutData: ICheckoutData) => {
    setOpenCheckout(true);
    setIsGettingCredit(false);
    setOpenTransferCredit(false);
    setCheckoutData(checkoutData);
  };

  const getUserInformation = async (): Promise<void> => {
    try {
      const response = await apiServer.getUserDashBoardInformation();
      setUserDashboardInformation(response.result.data);
    } catch (error) {
      setUserDashboardInformation({});
    }
  };// Home function 

  const getCurrentOnlineSessions = async () => {
    try {
      const response = await apiServer.getLiveSessionUsers();

      console.log(`live session users`, response.result.data);
      setLiveSessionUsers(response.result.data);
    } catch (error) {
      setLiveSessionUsers([]);
    }
  };

  const getPlatformUsers = async () => {
    try {
      const response = await apiServer.getPlatformUsers();
      setPlatformUsers(response.result?.data?.users ?? []);
    } catch (error) {
      setPlatformUsers([]);
    }
  };

  const getUserTransactions = async () => {
    try {
      const response = await apiServer.getUserTransactions();
      setTransactions(response.result?.data?.transactions ?? []);
    } catch (error) {
      setTransactions([]);
    }
  };

  useEffect(() => {
    getUserInformation();
    getPlatformUsers();
    getUserTransactions();
    getCurrentOnlineSessions();
    // setInterval(() => {
    //   getCurrentOnlineSessions();
    //   //   getUserInformation();
    // }, 10000);
  }, []);


  const onMessageChange = (event: any) => {
    const message = event.target.value;
    setMessage(message);
  };

  const sendChat = async (event: any): Promise<void> => {
    event.preventDefault();
    if (isOnline) {
      if (message && message !== '') {
        const payload = {
          type: 'chat',
          author: `${userDashboardInformation.user_email}`,
          text: message,
        };
        sendMessage(broadcastLink, payload, messageContentRef, null);
      }
    } else {
      notification({
        title: 'Broadcasting',
        type: 'warning',
        message: 'You are currently offline, action not allowed',
      });
    }
    setMessage('');
  };

  const joinBroadCast = async (link: string,) => {
    try {
      const id = userDashboardInformation.user_id;

      
      agClient = await createAgoraClient({
        userId: id,
      });

      agClient?.on('user-published', handleUserPublish);
      await registerEvent('user-joined', handleUserJoined);
      await registerMessagingEvent('message', handleChannelMessage);

      await joinBroadCastInit(link, id);

      if (link.includes(id)) {
        let localTrack = await createLocalTrack();  //creates a local track for the user

        setLocalTracks(
          (): [IMicrophoneAudioTrack, ICameraVideoTrack] => localTrack!// sets the local track to the localTracks state
        );

        await addLocalUserToView(localTrack!);

        if (localTrack) {
          const [, videoTrack] = localTrack;
          videoTrack.setMuted(false);
        }
      }

      await updateBroadcastMemberDetails(
        [
          {
            key: 'id',
            value: id,
            revision: -1,
          },
          {
            key: 'email',
            value: userDashboardInformation.user_email,
            revision: -1,
          },
        ],
        id
      );

      await broadcastMessage(link, {
        type: 'chat',
        text: `Welcome to the broadcast ${userDashboardInformation.user_email}`,
        author: '🤖 Bot',
      });

    } catch (error) { }
  };


  const endBroadcast = async () => {
    try {
      leaveBroadcastChannel(localTracks, userDashboardInformation.user_id).then(
        () => {
          setEnable(false);
          setIsStreaming(false);
          setIsOnline(false);
          localTracks[1]?.close();
          localTracks[0]?.close();
          updateOnlineStatus(false);
          setBroadcastLink(
            `streaming-app-chat-${userDashboardInformation.user_id}`
          );
        }
      );

      sendMessage(
        broadcastLink,
        {
          type: 'chat',
          text: `${userDashboardInformation.user_email} has left the broadcast`,
          author: '🤖 Bot',
        },
        messageContentRef,
        null
      );
    } catch (error) {
      notification({
        title: 'Broadcasting',
        type: 'danger',
        message: 'Error occurred when ending the broadcast',
      });
    }
  };

  const handleUserJoined = async (user: any) => {
    // setRemoteTracks(
    //   (): any[] => remoteTrack! // sets the remote track to the remoteTracks state
    // );
    alert(`user joined ${user.uid}`);
  }

  const handleChannelMessage = async (event: any) => {
    try {
      const { message } = event;

      const parsedMessage = JSON.parse(message);

      if (parsedMessage?.type === 'chat' || parsedMessage?.type === 'payment') {
        await handleBroadcastingChannelMessaging(
          parsedMessage,
          messageContentRef
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addLocalUserToView = async (
    localTrack: [IMicrophoneAudioTrack, ICameraVideoTrack]
  ) => {
    try {

      await publishTrack(localTrack); // sends the local video and audio to the agora client
      await handleAddLocalUserToView( // adds the local video and audio to the view
        broadcasterRef,
        userDashboardInformation.user_id
      );

      localTrack[1]?.play(`user-${userDashboardInformation.user_id}`);// plays the local video

    } catch (error) {
      notification({
        title: 'Broadcasting',
        type: 'danger',
        message: 'Error occurred while playing the broadcast',
      });
    }
  };

  const handleUserPublish = async (user: any, mediaType: string) => {  
    try {

      await subScribeUser(user, mediaType);

      if (mediaType === 'video') {
        user?.videoTrack?.play(`remote-stream`);
      }

      if (mediaType === 'audio') {
        user?.audioTrack?.play();
      }
    } catch (error) {
      notification({
        title: 'Broadcasting',
        type: 'danger',
        message: 'Error occurred while member joining the broadcast',
      });
    }
  };

  const startBroadCast = async (link: string) => {
    try {
      setIsStreaming(true);
      setEnable(true);
      if (!isOnline) {
        joinBroadCast(link).then(async () => {
          setIsOnline(true);
          setEnable(false);
        });

        window.addEventListener('beforeunload', () => {
          try {
            endBroadcast();
          } catch (error) { }
        });
      }
    } catch (error) {
      setIsStreaming(false);
      setEnable(false);
      notification({
        title: 'Broadcasting',
        type: 'danger',
        message: 'Error occurred when starting the broadcast',
      });
    }
  };

  const isUserCurrentStreamer = () => {
    const streamerId = broadcastLink?.split('chat-') ?? '';
    setCurrentStreamer(streamerId[1]);
  };

  const handleCloseCheckout = () => {
    setOpenCheckout(false); // Set openCheckout to false to close the popup
  };

  const toggleCamera = async () => {
    if (localTracks) {
      await localTracks[1].setMuted(!cameraMuted);
      setCameraMuted(!cameraMuted);
    }
  };

  const toggleMic = async () => {
    if (localTracks) {
      await localTracks[0].setMuted(!micMuted); 
      setMicMuted(!micMuted);
    }
  };

  useEffect(() => {
    isUserCurrentStreamer();
  }, [broadcastLink]);

  return (
    <WithAuthMiddleware>
      <div id='root'>
        <main className='tracking-wide font-roboto min-h-screen grid content-start dark bg-gray-900'>
          <div className='bg-white border-b dark:bg-gray-900 dark:border-gray-700 lg:fixed lg:w-full lg:top-0 lg:z-50 lg:left-0'>
            <div className='p-4 mx-auto flex justify-end'>
              <div className="flex lg:mt-0  sm:space-y-0 ">
                <div className="rrelative sm:w-96">
                  <input className='w-full h-full px-2 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg peer dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:outline-none focus:ring focus:ring-primary dark:placeholder-gray-400 focus:ring-opacity-20'
                    type="text" placeholder="Search for a user" >
                  </input>
                </div>
                <Button
                  onClick={signUserOut}
                >
                  <span className="relative px-5 py-2.5 rounded-md ">
                    Log out
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap w-full p-4 mx-auto mt-4 lg:pt-20'>
            {/* // Transactions Section */}
            <div className='w-1/4'>
              <div className='rounded-md bg-gray-100 dark:bg-gray-800 pt-4 m-2 overflow-hidden'>
                <div className="items-center  px-3 py-2 mx-3 mb-2">

                  <ProfileDisplay userDashboardInformation={userDashboardInformation} />

                  <div className='w-full flex flex-col items-center mb-4'>
                    {isOnline && (
                      <>
                        <Button
                          onClick={() => {
                            setOpenCheckout(false);
                            setIsGettingCredit(false);
                            setOpenTransferCredit(true);
                            setShowTransactions(false);
                          }}
                        >
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Credit User
                          </span>
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => {
                        setIsGettingCredit(true);
                        setOpenCheckout(false);
                        setOpenTransferCredit(false);
                        setShowTransactions(false);
                      }}>
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Buy Credits
                      </span>
                    </Button>

                    <Button
                      onClick={() => {
                        setShowTransactions(!showTransactions);
                        setIsGettingCredit(false);
                        setOpenCheckout(false);
                        setOpenTransferCredit(false);
                      }}
                    >
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        {showTransactions ? 'Hide Transactions' : 'Check Transactions'}
                      </span>

                    </Button>

                  </div>

                  <TransactionsList transactions={transactions} showTransactions={showTransactions} />

                  {isOnline && openTransferCredit && (
                    <TransferCredit
                      broadcastLink={broadcastLink}
                      user={userDashboardInformation}
                      platformUsers={
                        !isOnline
                          ? platformUsers
                          : isOnline &&
                            userDashboardInformation.user_id === currentStreamer
                            ? platformUsers
                            : liveSessionUsers
                      }
                    />
                  )}

                  {isGettingCredit && (
                    <CheckoutForm handleOpenCheckout={handleOpenCheckout} />
                  )}

                  <CheckoutPopup openCheckout={openCheckout} checkoutData={checkoutData} onClose={handleCloseCheckout} />

                </div>
              </div>
            </div>
            {/* // Streaming Section */}
            <div className='w-3/4'>
              <div className='rounded-md bg-gray-100 dark:bg-gray-800 m-2 overflow-hidden'>
                <section className='m5 flex gap-[1rem] justify-center'>

                  {enable ? (
                    <Loader color='white' />
                  ) : (
                    <>
                      {!isOnline ? (
                        <button
                          className='relative inline-flex items-center justify-center p-0.5 m-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800'
                          onClick={() => {
                            isUserCurrentStreamer();
                            const link = `streaming-app-chat-${userDashboardInformation?.user_id}`;
                            setBroadcastLink(link);
                            startBroadCast(link).then(() => {
                              updateOnlineStatus(true);
                            });
                          }}
                        >
                          {' '}
                          <span className="relative inline-block align-middle  px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            <MdLiveTv className="inline-block align-middle mr-1 text-2xl " /><span className="inline-block align-middle">Go Live!</span></span>
                        </button>
                      ) : null
                      }
                    </>
                  )}

                  {userDashboardInformation.user_id === currentStreamer && isOnline && (
                    <>
                      <Button className='cursor-pointer text-white bg-gradient-to-br from-red-500 to-red-700 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center me-2 mb-2 mt-5' onClick={endBroadcast}>
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          End Live
                        </span>
                      </Button>

                    </>
                  )}
                </section>
                {isStreaming && (
                  <>
                    <section className='flex gap-[1rem] m-5 rounded-md'>
                      <div className='w-[70%]'>

                        {userDashboardInformation.user_id !== currentStreamer && (
                          <div className="streamBox mb-[1rem] relative online">
                            <video id='remote-stream' className='streamer_player' autoPlay></video>
                            <button className='cursor-pointer text-white bg-red-500 p-2' onClick={endBroadcast}>
                              Leave session
                            </button>
                          </div>//watcher box
                        )}
                        {userDashboardInformation.user_id === currentStreamer && (
                          <div
                            ref={broadcasterRef}
                            className={classNames(
                              'streamBox mb-[1rem] relative',
                              isOnline ? 'online' : 'offline'
                            )}
                          >
                          </div>
                        )}
                        <div className="text-center">
                          <button id="toggle-camera-button" className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={toggleCamera}>
                            {cameraMuted ? <PiVideoCameraLight /> : <PiVideoCameraSlash />}
                          </button>
                          <button id="toggle-mic-button" className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={toggleMic}>
                            {micMuted ? <PiMicrophone /> : <PiMicrophoneSlash />}
                          </button>
                        </div>

                      </div>
                      <div className='w-[30%]  rounded-md  dark:bg-gray-400 ml-2 mt-0 mr-2 mb-2 pt-2 pl-2 pr-2'>
                        <div
                          className='h-[400px]  overflow-y-auto scrollable-content'
                          ref={messageContentRef}
                        ></div>
                        <div className='h-[2rem]'>
                          <form onSubmit={sendChat}>
                            <input
                              value={message ? message : ''}
                              onChange={onMessageChange}
                              type={'text'}
                              className='w-[100%] rounded-md'
                              placeholder='Enter a message...'
                            />
                          </form>
                        </div>
                      </div> {/* Message box */}
                    </section>
                  </>
                )}
              </div>
              <div className="rounded-md bg-gray-100 dark:bg-gray-800 m-2 overflow-hidden">
                {!isStreaming && userDashboardInformation.user_id !== currentStreamer && (
                  <>
                    {liveSessionUsers.map((user: any, index: number) => {
                      return (
                        <div key={index} className='flex gap-[1rem] p-4'>
                          <button className="stream-mini"
                            onClick={() => {
                              const link = `streaming-app-chat-${user?.user_id}`;
                              setBroadcastLink(() => link);
                              startBroadCast(link);
                            }}>

                            {/* Additional styling for the stream container */}
                            <div className="stream-content">
                              <div className="relative w-full h-full">
                                <FaRegCirclePlay className="absolute transition-opacity duration-300 text-6xl inset-0 m-auto text-white opacity-75" />
                                <Image
                                  src={StreamerImage}
                                  alt='user'
                                  className="object-cover transition-opacity duration-300 hover:opacity-75 w-full h-full"
                                />
                              </div>
                            </div>
                          </button>
                          <div className="flex flex-col text-white">
                            <h1 className='pl-0 pt-2'>{`${user?.user_email}`}</h1>
                            <p className="text-sm mt-4">Live</p>
                          </div>

                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div >
    </WithAuthMiddleware >

  );
};

export default Home;
