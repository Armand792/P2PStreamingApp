import { MutableRefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  broadcastMessage,
  leaveBroadcast,
  removeBroadcastMemberDetails,
  unPublishTrack,
} from './agoraManager';

export const handleAddLocalUserToView = async (
  domRef: MutableRefObject<any>,
  userId: string
) => {
  try {
    if (document.getElementById(`user-${userId}`) === null) {
      const player = ` <div class='streamer_player ' 
                  id=${`user-${userId}`}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 mx-auto mb-4 text-center">
                
                </div>`;
      domRef?.current?.insertAdjacentHTML('beforeend', player);
    }
  } catch (error) {}
};

export const sendMessage = async (
  channel: string,
  message: any,
  messageContentRef: MutableRefObject<any>,
  config = null
) => {
  try {
    await broadcastMessage(channel, message);
    await addMessageToView(messageContentRef, message, config);
  } catch (error) {}
};

export const addMessageToView = async (
  messageContentRef: MutableRefObject<any>,
  message: any,
  config = null
) => {
  try {
    const messageId = `message-${uuidv4()}`;

    const messageView = `<div class="bot_chat_MessageContainer" id=${messageId}>
                  <h1 class="chatMessageName ChatFontSize">${message?.author}: </h1>
                  <p class="chatMessageTextChatFontSize">${message?.text}</p>
                </div>`;

    messageContentRef?.current?.insertAdjacentHTML('beforeend', messageView);
    const lastMessage = document.getElementById(`${messageId}`);

    lastMessage?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  } catch (error) {}
};

export const addMessagePaymentToView = async (
  messageContentRef: MutableRefObject<any>,
  message: any,
  config = null
) => {
  try {
    const messageId = `message-${uuidv4()}`;

    const messageView = `<div class="bot_chat_MessageContainer" id=${messageId}>
                  <h1 class="chatMessageName ChatFontSize">${message?.author}: </h1>
                  <p class="payment">${message?.text}</p>
                </div>`;

    messageContentRef?.current?.insertAdjacentHTML('beforeend', messageView);
    const lastMessage = document.getElementById(`${messageId}`);

    lastMessage?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  } catch (error) {}
};

export const handleBroadcastingChannelMessaging = async (
  message: any,
  messageContentRef: MutableRefObject<any>
) => {
  const parsedMessage = message;
  if (parsedMessage?.type === 'chat') {
    await addMessageToView(messageContentRef, parsedMessage);
  }

  if (parsedMessage?.type === 'payment') {
    await addMessagePaymentToView(messageContentRef, parsedMessage);
  }
};

export const leaveBroadcastChannel = async (tracks: any, userId: any) => {
  try {
    await removeBroadcastMemberDetails(userId);
    await leaveBroadcast();
    await unPublishTrack(tracks);
  } catch (error) {}
};


