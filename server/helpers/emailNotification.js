import winston from 'winston';
import smtpTransport from 'nodemailer-smtp-transport';
import cron from 'node-cron';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


// sending daily email notification
const sendDailyNotificationByEmail = () => {
  // setting up the transporter
  const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: 'mydiaryjscript@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  }));
  // sending emails at periodic intervals
  cron.schedule('1 * * * * * ', () => {
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
        users.user.forEach((user) => {
          if (user.notification === true) {
            emails.push(user.email);
          }
        });
        const mailOptions = {
          from: 'mydiaryjscript@gmail.com',
          to: emails.toString(),
          subject: 'Daily Notification;)',
          text: 'Hi there, this email is sent to remind you to pen down your feelings and thought. Thank you',
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            winston.log(error);
          } else {
            winston.log(info, 'Email successfully sent!');
          }
        });
      }).catch(err => winston.log(err));
  });
};

export default sendDailyNotificationByEmail;
