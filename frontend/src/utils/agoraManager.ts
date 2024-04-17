import AgoraRTC, {
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTC,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';

const config: {
  screenSharing: boolean;
  appID: string;
  mode: string;
  codec: string;
} = {
  screenSharing: false,
  appID: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
  mode: 'live',
  codec: 'vp9',
};

let client: IAgoraRTCClient | null = null;
let messageClient: any = null;
let broadcastChannel: any = null;


export const getRemoteUsers = async () => {
  try {
    const remoteUsers = client?.remoteUsers;
    return remoteUsers;
  } catch (error) {}
};

export const createAgoraClient = async ({ userId }: { userId: string }) => {
  try {
    client = AgoraRTC.createClient({ // Create an AgoraRTC client
      mode: 'live', //should be live
      codec: 'vp9',
    });

    messageClient = new AgoraRTM.RTM(config.appID, userId, {}); // Create an AgoraRTM client

    return client;
  } catch (error) {}
};

export const joinBroadCastInit = async (
  broadcastingRoomID: string,//link
  userID: string // id
) => {
  try {
    const joinResult = await client?.join(config.appID, broadcastingRoomID, null, userID);
    const remoteUsers = await getRemoteUsers();

    await messageClient?.login();
    await messageClient?.createStreamChannel(broadcastingRoomID);
    await messageClient?.subscribe(broadcastingRoomID);

    return {
      joinResult,
      remoteUsers,
    };
    
  } catch (error) {}
};

export const leaveBroadcast = async () => {
  try {
    await client?.leave();
    await broadcastChannel.release();
    await broadcastChannel?.leave();
    await messageClient?.logout();
  } catch (error) {}
};

export const getBroadCastMembers = async (channel: string) => {
  try {
    return messageClient.presence.getOnlineUsers(channel, 'MESSAGE', {
      includedState: true,
    });
  } catch (error: any) {
    console.log(error);
  }
};

export const removeBroadcastMemberDetails = async (userId: string) => {
  try {
    await messageClient.storage.removeUserMetadata({
      userId: userId,
    });
  } catch (error) {}
};

export const updateBroadcastMemberDetails = async (
  data: any,
  userId: string
) => {
  try {
    await messageClient.storage.setUserMetadata(data, {
      userId: userId,
      addTimeStamp: true,
      addUserId: true,
      majorRevision: -1,
    });
  } catch (error) {}
};

export const broadcastMessage = async (channel: string, message: any) => {
  await messageClient.publish(channel, JSON.stringify(message));
};

export const createLocalTrack = async (): Promise<
  [IMicrophoneAudioTrack, ICameraVideoTrack] | undefined
> => {
  try {
    return await AgoraRTC.createMicrophoneAndCameraTracks(
      {
        ANS: true,
        AEC: true,
      },
      {
        optimizationMode: 'detail',
        encoderConfig: {
          bitrateMax: 3000,
          bitrateMin: 2000,
          frameRate: 30,
          height: { max: 1280, min: 720 },
          width: { max: 1280, min: 720 },
        },
      }
    );
  } catch (error) {}
};

export const subScribeUser = async (user: any, mediaType: any) => {
  try {
    await client?.subscribe(user, mediaType);
  } catch (error) {}
};

export const publishTrack = async (tracks: any[]) => {
  try {
    await client?.setClientRole('host');
    await client?.publish([tracks[0], tracks[1]]);
  } catch (error) {
    console.log(error);
  }
};

export const unPublishTrack = async (tracks: any[]) => {
  await client?.unpublish([tracks[0], tracks[1]]);
};

export const registerEvent = async (eventName: string, handler: any) => {
  client?.on(eventName, handler);
};

export const registerMessagingEvent = async (
  eventName: string,
  handler: any
) => {
  messageClient.addEventListener(eventName, handler);
};






