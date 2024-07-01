import axios from 'axios';
import React from 'react';

export const NotificationSend = async (token, title, body) => {
  const accessToken = 'ya29.c.c0AY_VpZgvERFVpkx_3HDwEBk_9tj-WJqee6yeZbRiCrnY__9Dj6Sa4HZKhOGCeARB6oIPKiW0j2xnimhrGP-A2qQKTRqpe1DO_DWUqzp30mpYs6Qu2yx-51fv-M4LrJD10gviwaaTvjQ7O_uy1eQjJKwClvyG_Q34Vt8s44L88j6kvZKB1vTlj_YPdprx0JDoNf7yxA3OlNiQcOyKBhWmZNZbySJhiJTE2XxU70NTyjzaxnLKdrxV93W-c8EooLX_FtYkG6N7JDc3ZtE0yJDBxwwm3tRuFDx-pT0G4iEIJTkO2WckuViV9LEJH5VXhS8Q0WZgyGltzHw2XBBFhU90Vm6tt80kL9V2VwwT3aufyB2txeQTwZzd84mVYAL387KOwmRdnbmVmlbWbbUMBvUJ7djpaodevvspvQXv6vwwWo3ag-lOR-Iz0_SuzJqyMcqSqqkF8vSRoeqlqiw3X8ZezJIUJI7RppZmMWXjyRtx6YheXkWVnruizYSuFtbYY906R3_2QQ27_cidx7Ff_o2m0ItfBoq_iu5e1sl4QoIk8Suo3VZYhdYvjXl3bac0kQr7qnBsfejWxZ3xipQwlon_WlF2Xjdmz6tUqntbV81IJkFMUyUOaR0i4iXt8J5Rg58c_pQ79MW-aIjw1cWmlt4rgzbMFkZV4XF4gZXr7Qteo35_iZF969IUfi_B8uyZnbFfsbvkqM6sUBa_Z7t6qkZFWF18xIM7pjdqpWha4le_dwMcI0J0dsbS0hz39yo9_o8nY-u6MSYOFoXt1oJFyBirIBkSVkW_v-SRvber37rzh8_1iyxcsnvmp-IuQe_RzjyamcUFhnqyMjbaWf0Vklrc0JorSujSMx_IV6dFoljMYkbBxcXlU9Imx5h18cmzsXRwVrJm9itFgqd5Yq-obatFz54iR8m868X6xx-Y4Ww1o_qm-iw2h_YXlnb9bjzhRktW0ZMjqnWrg31i8b2Z3w60zplZm5Bu6F3qYv9b3Rz0eZllXn5lX2fRevR'; // The access token obtained from the previous step
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