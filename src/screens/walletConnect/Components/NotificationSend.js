import axios from 'axios';
import React from 'react';

export const NotificationSend = async (token, title, body) => {
  const accessToken = 'ya29.c.c0AY_VpZhZl4Tl63GrcpgFDRaV6SnYmZHwVvD2M34cKNyPDx90GcM_HuERlTMq3mJoQcsCxtwZMK1nWjnsAk7t36EZ0dJEvVCjg0W_JERWNoPORrmQm2-yalAl0OMv_QprwGpI_Xpbyap2L8MHgDgvk-LgVAL6ocmOF7--ByKF7Sfyz3-uuvn7xaWkAO0uVGrtpz66IVJw0Cb--xlcxhK2OLM37WD2ja4wk_oZYB4RWVacWH-sEPCe6M95dihOs85NJyTD6qtzRUhuEh9zcZuZr7h2zm2obqAC5npJaitV5mepeJrG6DF9LIV79jTQuCrAhF055_5Vn0dvl7GnNuQd9Tw0DOH9T6HmQmCBhjEbRAcgGGO6GZ43wr2KN385K5foqw4w2JRBBX_sOYj7clOX2J2Scye5VkxRS6532UzMvXiaZ0Fiy6c2RBrqIFgSdp5OJZiwXrBxcnJ_5qkB2Iprd-lQiQ4Wnr4biziS3gYWoFxWOj9i2o0RbWQiwd5IlQsrBcIkW7x7-gbFfW19s6Is7kY4Fb2WcXcxMS5jgfkmVeUhWF38VsasOW1tdrU4cRzXWzRBX584Bt7bxnl1BkvRMkOYftvS7MxtByS0Ui5xgaR_V5wBXYor9vp5IZle7tYOXo6ith98Sz98-2V7vgtxufMtdqy8QZsOhwWi8SFn-cBsudec-V3lrraQfnq_WscwSWngnbnvR2s-17M_SUv0-eB8duxn_lbn4-sjWsXustQ2xcvdaf4YM_ur0a952c2820Xw5bXFIvbm9hQkfuhbSQjg-wh6u4IoVIsXZf9qtgoaszlti-QSmemqhZYXmll-0Sqfden1RnW_fp_xy6isrbv8YV3wvrsf-Z0p8mxec266V-zkwxIylcYpWu3wkgMFzBatRW1b6tZVh6cbqfI7n-JhVWIybwSkzIh2rRdtrbl1vIkegX3MMjxOXb-6_UwVjbJSFc002zj548nzl-qv4JB21QZqhRqX2O1d8kQ3jwjnvjS1-2ll3v1'; // The access token obtained from the previous step
  const apiUrl = `https://fcm.googleapis.com/v1/projects/rifp2p/messages:send`;

  const message = {
    message: {
      token: token,
      notification: {
        title: title,
        body: body,
      },
    },
  };

  try {
    const response = await axios.post(apiUrl, message, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response.data);
  }
};