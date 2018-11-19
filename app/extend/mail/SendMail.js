'use strict';

const nodemailer = require('nodemailer');

module.exports = {
    send(code, mail) {
        const transporter = nodemailer.createTransport({
            // host: 'smtp.ethereal.email',
            service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
            port: 465, // SMTP 端口
            secureConnection: true, // 使用了 SSL
            auth: {
                user: '2393118215@qq.com',
                // 这里密码不是qq密码，是你设置的smtp授权码
                pass: 'pzgugmjobqrfeahe',
            },
        });

        const mailOptions = {
            from: '"在线开放教育平台团队" <mail@davidwong.cn>', // sender address
            to: mail, // list of receivers
            subject: '注册验证码', // Subject line
            // 发送text或者html格式
            // text: 'Hello world?', // plain text body
            html: `<p>亲爱的用户：</p>
                   <p>&nbsp;&nbsp;&nbsp;&nbsp;感谢你注册在线开放教育平台！</p>
                   <p>&nbsp;&nbsp;&nbsp;&nbsp;以下为注册验证码：</p>
                   <h2 style="color:red;">&nbsp;&nbsp;&nbsp;&nbsp;${code}</h2><br>
                   <br>
                   <p>&nbsp;&nbsp;&nbsp;&nbsp;验证码十分钟内有效，过期无效，收到后请立即使用</p>
                   <p style="float:right">感谢你的支持</p>
                   <p style="float:right">在线开放教育平台团队</p>`, // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            return info.messageId;
            // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
        });
    },
};
