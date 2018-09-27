import console from 'console';
import cron from 'node-cron';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


// sending daily email notification
const sendDailyNotificationByEmail = () => {
  // setting up the transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mydiaryjscript@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // sending emails at periodic intervals
  cron.schedule('* * 7 * * * ', () => {
    const usersUrl = 'https://sulenchy-my-diary.herokuapp.com/api/v1/users';
    fetch(usersUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((users) => {
        const emails = ['mydiaryjscript@gmail.com'];
        for (const user of users.user) {
          if (user.notification === true) {
            emails.push(user.email);
          }
        }
        const mailOptions = {
          from: 'mydiaryjscript@gmail.com',
          to: emails.toString(),
          subject: 'Daily Notification;)',
          text: 'Hi dear, do not forget to pen down your feelings and thought. \n\n Thank you',
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email successfully sent!');
          }
        });
      }).catch(err => console.log(err));
  });
};

export default sendDailyNotificationByEmail;
