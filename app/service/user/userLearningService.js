'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class userLearningService extends Service {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 处理添加申报信息
    async userGetCourseList() {
        const { ctx } = this;
        const data = await ctx.model.Course.getCourseList();
        return data;
    }

    // 查找课程信息
    async userGetCourseIntroduce(id) {
        const { ctx } = this;
        const data = await ctx.model.Course.getCourseIntroduce(id);
        return data;
    }
    
    // 检查用户是否已经参加了本课程学习
    async userCheckHaveAttend(body) {
        const { ctx } = this;
        const data = await ctx.model.Learning.userCheckHaveAttend(body);
        if (data === undefined || data === null) {
            return '0'
        } else {
            return '1';
        }
    }

    // 用户获取课程目录
    async userGetCourseCatalog(doc) {
        const { ctx } = this;
        const catalogdoc = `${pc.catalogdoc}/${doc}.json`;
        
        const writeFunc = async function(coursedocCtime) {
            const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            const catalog = {
                ctime: coursedocCtime,
                data: []
            };
            data.forEach((citem, cindex) => {
                catalog.data.push({
                    "chapterName": citem.chapterName,
                    "section": [],
                });
                citem.section.forEach((sitem, sindex) => {
                    if (sitem.status == '1') {
                        catalog.data[cindex].section.push({
                            sectionName: sitem.sectionName,
                        })
                    }
                })
            });
            await ctx.helper.writeFile(`${pc.catalogdoc}/${doc}.json`, JSON.stringify(catalog));
            return catalog.data;
        };
        
        return new Promise((resolve, reject) => {
            fs.stat(`${pc.coursedoc}/${doc}.json`, function (err, data) {
                resolve(data.ctime);
            });
        }).then(async function(result) {
            const coursedocCtime = result;
            // 先查查是否已生成了目录文件，未生成，先生成，并把coursedoc的信息放到里面（ctime+data）
            if (!fs.existsSync(catalogdoc)) {
                return writeFunc(coursedocCtime);
            }
            // 如果已经有了文件，那么就查查coursedoc的ctime跟目录文件所记录的ctime是否一样
            // 一样就不用再读coursedoc，不一样就读coursedoc的内容，更新目录文件的内容
            const catalogdocData = await ctx.helper.readFile(`${pc.catalogdoc}/${doc}.json`);
            if (catalogdocData.ctime != coursedocCtime) {
                return writeFunc(coursedocCtime);
            }
            return noChangeData.data;
            
        });
    }
    
    // 用户参与课程学习
    async userAttendStudy(doc, mail, courseId) {
        const { ctx } = this;
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        await ctx.helper.makeDir(`${pc.userdoc}/${userdoc}`);

        return new Promise((resolve, reject) => {
            fs.stat(`${pc.coursedoc}/${doc}.json`, function (err, data) {
                resolve(data.ctime);
            });
        }).then(async function(coursedocCtime) {
            // 创建用户文件,并根据课程目录生成数据
            const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            const user = {
                ctime: coursedocCtime,
                data: []
            };
            data.forEach((citem, cindex) => {
                user.data.push({
                    "chapterName": citem.chapterName,
                    "section": [],
                });
                citem.section.forEach((sitem, sindex) => {
                    if (cindex == 0 && sindex == 0) {
                        user.data[cindex].section.push({
                            sectionName: sitem.sectionName,
                            video: '0',     // 0为未看，1已观看到3分之1，直到3
                            practice: '0',      // 0为未完成，已完成则为一个记录题目答案回答的数组
                            status: '1',        // 0为未解锁章节，1为当前章节，2为已完成章节
                        })
                    } else {
                        user.data[cindex].section.push({
                            sectionName: sitem.sectionName,
                            video: '0',     // 0为未看，1已观看到3分之1，直到3
                            practice: '0',      // 0为未完成，已完成则为一个记录题目答案回答的数组
                            status: '0',        // 0为未解锁章节，1为当前章节，2为已完成章节
                        })
                    }
                })
            });
            const learningId = ctx.helper.getSaltyMd5(mail+courseId+Date.now()+Math.random()*10000, 'userdoc');
            await ctx.helper.writeFile(`${pc.userdoc}/${userdoc}/${doc}.json`, JSON.stringify(user));
            // 数据库数据插入
            return await ctx.model.Learning.userAttendLearning(learningId, mail, courseId);
        });
    }

    // 用户获取课程目录(包括学习进度)
    async userGetCourseProgress(doc, mail, courseId) {
        const { ctx } = this;
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        return new Promise((resolve, reject) => {
            fs.stat(`${pc.coursedoc}/${doc}.json`, function (err, data) {
                resolve(data.ctime);
            });
        }).then(async function(coursedocCtime) {
            // 先读取用户文件的ctime并进行判断
            const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
            const courseData = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            if (userdocData.ctime != coursedocCtime) {
                const user = {
                    ctime: coursedocCtime,
                    data: []
                };
                courseData.forEach((citem, cindex) => {
                    user.data.push({
                        "chapterName": citem.chapterName,
                        "section": [],
                    });
                    citem.section.forEach((sitem, sindex) => {
                        if (sitem.status == '1') {
                            const changeData = {
                                sectionName: sitem.sectionName,
                            }
                            // 当主目录文件添加了新课程后，用户的映射目录是没有的，即undefined，需要加工数据再写入
                            if (userdocData.data[cindex] == undefined || userdocData.data[cindex].section[sindex] == undefined) {
                                if (sindex == 0 && cindex != 0) {
                                    // 状态为不为已完成，节状态都为0
                                    const status = userdocData.data[cindex-1].section[userdocData.data[cindex-1].section.length-1].status;
                                    if (status == '2') {
                                        changeData.video = '0';
                                        changeData.practice = '0';
                                        changeData.status = '1';
                                    } else {
                                        changeData.video = '0';
                                        changeData.practice = '0';
                                        changeData.status = '0';
                                    }
                                } else if (sindex == 0 && cindex == 0) {
                                    changeData.video = '0';
                                    changeData.practice = '0';
                                    changeData.status = '0';
                                } else {
                                    // 当前节索引，章索引不为0
                                    const status = user.data[cindex].section[user.data[cindex].section.length-1].status;
                                    if (status == '2') {
                                        changeData.video = '0';
                                        changeData.practice = '0';
                                        changeData.status = '1';
                                    } else {
                                        changeData.video = '0';
                                        changeData.practice = '0';
                                        changeData.status = '0';
                                    }
                                }
                            } else {
                                // 没有改变直接写入
                                changeData.video = userdocData.data[cindex].section[sindex].video;
                                changeData.practice = userdocData.data[cindex].section[sindex].practice;
                                changeData.status = userdocData.data[cindex].section[sindex].status;
                            }
                            user.data[cindex].section.push(changeData);
                        }
                    })
                });
                await ctx.helper.writeFile(`${pc.userdoc}/${userdoc}/${doc}.json`, JSON.stringify(user));
                return await user.data;
            }
            return userdocData.data;
        });
    }

    // 用户获取学习资源
    async userGetLearningInfo(doc, courseId, cindex, sindex, courseName) {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        })
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
        const courseData = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        const learnInfo = {
            videoUrl: `${pc.proxyVideo}/${courseId}/${courseData[cindex].section[sindex].sectionId}/prod/`,
            videoTag: userdocData.data[cindex].section[sindex].video,
            pptUrl: `${pc.proxyPPT}/${courseId}/${courseData[cindex].section[sindex].sectionId}/${courseData[cindex].section[sindex].ppt}`,
            sectionName: courseData[cindex].section[sindex].sectionName,
            chapterName: courseData[cindex].chapterName,
            courseName,
        };
        return learnInfo;
    }

    // 视频观看进度监察
    async userWatchProgress(doc, cindex, sindex, duration, currentTime, videoTag) {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        })
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
        /**
         * 判断video的进度
         * userdoc的video为n，传来的videoTag必须为n+1，且videoTag必须大于0小于4
         * 接着将duration按videoTag乘比例，跟currentTime比较是否相等
         */
        if (videoTag <= 0 || videoTag > 3) {
            return 'invalid videoTag';
        }
        const userVideoTag = userdocData.data[cindex].section[sindex].video;
        if (parseInt(videoTag)-1 != userVideoTag) {
            return 'error videoTag';
        }
        const chunk = videoTag == 1 ? Math.floor(duration*0.33) : videoTag == 2 ? Math.floor(duration*0.66) : Math.floor(duration*0.963);
        if (chunk != currentTime) {
            return 'error progress';
        }
        userdocData.data[parseInt(cindex)].section[parseInt(sindex)].video = videoTag;
        await ctx.helper.writeFile(`${pc.userdoc}/${userdoc}/${doc}.json`, JSON.stringify(userdocData));
        return 'ok';
    }

    // 检查用户练习题的状态（是否观看完视频，是否已完成练习题）
    async userCheckPracticeStatus(courseId, cindex, sindex, doc) {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        })
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
        if (userdocData.data[cindex].section[sindex].video < 3) {
            return {
                status: '0'
            };
        } else if (userdocData.data[cindex].section[sindex].video == 3 && userdocData.data[cindex].section[sindex].practice == 0) {
            // 获取试题
            const courseData = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            let qIdArr = [];
            courseData[cindex].section[sindex].practice.forEach((item, index) => {
                qIdArr.push(item.qId);
            })
            return {
                status: '1',
                practice: arr,
            };
        } else if (userdocData.data[cindex].section[sindex].practice != 0 && userdocData.data[cindex].section[sindex].practice[0].reply == undefined){
            // 若统计后，用户为完成的练习会自动补上答案，给0分
            return {
                status: '3',
                practice: userdocData.data[cindex].section[sindex].practice,
            };
        } else {
            // 把试题与答案返回
            return {
                status: '2',
                practice: userdocData.data[cindex].section[sindex].practice,
            };
        }
    }

    // 用户提交练习（返回批改后的数据并记录到文件中）
    async userSubmitPractice(courseId, cindex, sindex, doc, reply) {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        })
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
        const finish = [];
        for (let i = 0; i < 5; i++) {
            const question = await ctx.model.Question.getAnswerByQid(reply[i].qId);
            const score = await ctx.service.user.userLearningService.checkAnswer(reply[i].reply, question.answer);
            finish.push({
                score: score? 20 : 0,
                title: question.title,
                options: question.options,
                reply: reply[i].reply,
                answer: question.answer,
            });
        }
        userdocData.data[cindex].section[sindex].practice = finish;
        userdocData.data[cindex].section[sindex].status = 2;
        // 看是否
        if (userdocData.data[+cindex+1] != undefined) {
            if (sindex == userdocData.data[cindex].section.length-1) {
                userdocData.data[+cindex+1].section[0].status = 1;
            } else {
                userdocData.data[cindex].section[++sindex].status = 1;
            }
        }
        await ctx.helper.writeFile(`${pc.userdoc}/${userdoc}/${doc}.json`, JSON.stringify(userdocData));
        return finish;
    }

    async checkAnswer(reply, answer) {
        if (reply == answer) {
            return true;
        }
        return false;
    }

     // 判断是否有下一章或下一节
     async userCheckNextSection(courseId, cindex, sindex, doc) {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        })
        const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
        const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
        // 如果这一节已经是本章最后一节，就看有没有下一章，否则就直接下一节
        if (cindex == userdocData.data.length -1 && userdocData.data[cindex].section.length-1 == sindex) {
            if (userdocData.data[cindex+1] == undefined? true : userdocData.data[cindex+1].section.length > 0? false : true) {
                // 已完成所有章节
                return {
                    finishTag: '2'
                };
            }
            
        } else {
            if (userdocData.data[cindex].section.length-1 == sindex) {
                // 还有下一节
                return {
                    finishTag: '1',
                    cindex: ++cindex,
                    sindex: 0
                };
            }

            // 还有下一节
            return {
                finishTag: '1',
                cindex: cindex,
                sindex: ++sindex,
            };
        }

    }

    // 获取考试信息
    async userGetExamInfo(courseId, mail) {
        const { ctx } = this;
        // 先从attend表查找是否有对应的courseId和mail，没有就是未报名
        const attendTag = await ctx.model.Attend.checkAttend(courseId, mail);
        // 未报名，查找出所有未开始可报名的考试出来返回
        if (attendTag == undefined || attendTag == null) {
            const data = await ctx.model.Exam.getAllExam(courseId);
            return {
                examTag: 0,
                data,
            };
        } else {
            // 已报名，查询是否已考试，status为1未考试，为2已开始考试，为3已完成考试
            let data, examTag;
            if (attendTag.status == 1) {
                // 未考试
                examTag = 1;
                data = await ctx.model.Exam.getExamInfoById(attendTag.examId);
                if (data.end < Date.now()) {
                    await ctx.model.Attend.removeAttend(courseId, mail);
                    const info = await ctx.model.Exam.getAllExam(courseId);
                    return {
                        examTag: 0,
                        data: info,
                    };
                }

            } else if (attendTag.status == 2) {
                examTag = 2;
                // 当开始考试后状态就为2，若离开页面，则考试作废，需重新报考
                // 即考试路由需要判断attend的status必须为1，若不为1，则删除相应的attend表数据
                await ctx.model.Attend.removeAttend(courseId, mail);

            } else if (attendTag.status == 3) {
                examTag = 3;
                // 未批改
                const { eTitle } = await ctx.model.Exam.getETitleById(attendTag.examId);
                data = {
                    eTitle,
                    eTime: attendTag.eTime,
                    score: '试卷正在批改，请耐心等待',
                }

            } else if (attendTag.status == 4) {
                examTag = 4;
                // 已批改
                const correctTag = await ctx.model.Learning.checkExamScore(courseId, mail);
                const { eTitle } = await ctx.model.Exam.getETitleById(attendTag.examId);
                data = {
                    eTitle,
                    eTime: attendTag.eTime,
                    score: correctTag.dataValues.examSorce,
                }
            }
            return {
                examTag,
                data,
            };
        }
    }
    
    // 用户报名考试
    async userAttendExam(courseId, mail, examId, attendId, doc) {
        const { ctx } = this;
        const computedTag = await ctx.model.Learning.checkLearinScore(courseId, mail);
        if (computedTag.learnSorce == null || computedTag.learnSorce == '') {
            // 计算平时成绩
            const userdoc = ctx.helper.getSaltyMd5(mail, 'userdoc');
            const userdocData = await ctx.helper.readFile(`${pc.userdoc}/${userdoc}/${doc}.json`);
            const courseData = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            let videoScore = 0;
            let practiceScore = 0;
            let count = 0;
            /**
             * videoTag == 3 就是100分，否则0分，占比40%
             * practice != 0 就计算成绩，否则0分，占比60%
             */
            for (const cindex in userdocData.data) {
                for (const sindex in userdocData.data[cindex].section) {
                    count++;
                    if (userdocData.data[cindex].section[sindex].video == 3) {
                        videoScore += 100;
                    } else {
                        userdocData.data[cindex].section[sindex].video = 4;
                        userdocData.data[cindex].section[sindex].status = 2;
                    }
                    if (userdocData.data[cindex].section[sindex].practice == 0) {
                        const data = [];
                        for (let i = 0; i < 5; i++) {
                            const dataValues = await ctx.model.Question.getAnswerByQid(courseData[cindex].section[sindex].practice[i].qId);
                            data.push({
                                score: 0,
                                title: dataValues.title,
                                options: dataValues.options,
                                answer: dataValues.answer,
                            })
                        }
                        userdocData.data[cindex].section[sindex].practice = data;
                    } else {
                        userdocData.data[cindex].section[sindex].practice.forEach(pitem => {
                            practiceScore += pitem.score;
                        })
                    }
                    
                }
            }
            await ctx.helper.writeFile(`${pc.userdoc}/${userdoc}/${doc}.json`, JSON.stringify(userdocData));
            const sum = Math.ceil(videoScore/count*0.4 + practiceScore/count*0.6);
            await ctx.model.Learning.userComputedLearningScore(mail, courseId, sum);
        }

        await ctx.model.Exam.addCount(courseId,examId);
        await ctx.model.Attend.attendExam(attendId, mail, examId, courseId);
        return;
    }

    // 进入考试路由，判断是否已经报名了考试
    async userCheckHaveAttendExam(courseId, mail) {
        const { ctx } = this;
        const data = await ctx.model.Attend.checkAttend(courseId, mail);
        if (data == undefined || data == null) {
            // 未参与
            return '0';
        } else {
            // 已开启考试，但考生已离开考试，删除考试信息
            return data.status;
        }
    }
    
    // 用户获取考卷
    async userGetExamPaper(cid, mail) {
        const { ctx } = this;
        const { examId } = await ctx.model.Attend.getExamId(cid, mail);
        const { paperId, eTitle, start } = await ctx.model.Exam.getExamPaperId(cid, examId);
        // 状态变为2，表明正在进行考试
        if (start > Date.now()) {
            throw new Error('is invalid time to exam');
        } else {
            await ctx.model.Attend.changeStatus(cid, mail, '2');
        }
        const detail = await ctx.model.Paper.getPaperJustDetail(paperId);
        const data = {
            info: {
                eTitle,
                examId,
            }
        };
        let temp;
        for (var item in detail) {
            data[item] = [];
            temp = await ctx.model.Question.getQuestionArrById(detail[item]);
            data[item].push(temp);
        }
        return data;
    }

    // 用户离开了考试
    async userLeaveExam(courseId, mail) {
        const { ctx } = this;
        // 删除Attend
        await ctx.model.Attend.removeAttend(courseId, mail);
        return;
    }

    // 用户提交考卷
    async userSubmitExamPaper(courseId, mail, examId, single , multiple, judge, gap, short) {
        const { ctx } = this;
        // 先把答案都存到finals表
        const finalId = ctx.helper.getSaltyMd5(courseId + mail + examId + Math.random()*10000 + Date.now(), 'finalId');
        await ctx.model.Final.addFinal(finalId, mail, examId, courseId, JSON.stringify(single), JSON.stringify(multiple), JSON.stringify(judge), JSON.stringify(gap), JSON.stringify(short));
        // 改卷
        let singleScore = 0;
        let multipleScore = 0;
        let judgeScore = 0;
        for (let i = 0; i < 15; i++) {
            if (single[i] == undefined) {
                continue;
            }
            const { answer } = await ctx.model.Question.getAnswerByQid(single[i].qId);
            if (answer == single[i].answer) {
                singleScore += 3;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (multiple[i] == undefined) {
                continue;
            }
            const { answer } = await ctx.model.Question.getAnswerByQid(multiple[i].qId);
            const mAnswer = JSON.stringify(multiple[i].answer);
            for (let j = 0; j <= answer.length; j++) {
                if (mAnswer.indexOf(answer[i]) == -1) {
                    multipleScore += 0;
                    break;
                } else {
                    if (j == answer.length) {
                        multipleScore += 4;
                    }
                }
            }
        }
        for (let i = 0; i < 6; i++) {
            if (judge[i] == undefined) {
                continue;
            }
            const { answer } = await ctx.model.Question.getAnswerByQid(judge[i].qId);
            if (answer == judge[i].answer) {
                judgeScore += 3;
            }
        }
        // 添加成绩
        await ctx.model.Attend.addSMJScorce(singleScore, multipleScore, judgeScore, courseId, mail, examId);
        await ctx.model.Attend.changeStatus(courseId, mail, '3');
        return;
    }
    
    // 用户获取我的课程信息
    async userGetMyCourseInfo(mail) {
        const { ctx } = this;
        const data = [];
        const scoreList = await ctx.model.Learning.getScoreByMail(mail);
        for (let i in scoreList) {
            const temp = {};
            temp.courseName = await ctx.model.Course.getCourseNameById(scoreList[i].courseId);
            if ((scoreList[i].learnSorce == null || scoreList[i].learnSorce == '') && scoreList[i].finalSorce == '') {
                temp.status = '正在学习课程';
            } else if (scoreList[i].learnSorce != null && (scoreList[i].examSorce == null || scoreList[i].examSorce == '')) {
                const correctTag = await ctx.model.Attend.checkCorrect(scoreList[i].courseId, mail);
                temp.learnSorce = scoreList[i].learnSorce;
                if (correctTag) {
                    temp.status = '考卷待批改';
                } else {
                    temp.status = '等待考试开考';
                }
            } else if (scoreList[i].finalSorce != null && scoreList[i].finalSorce != '') {
                temp.status = '课程已完成';
                temp.learnSorce = scoreList[i].learnSorce;
                temp.examSorce = scoreList[i].examSorce;
                temp.finalSorce = scoreList[i].finalSorce;
            }
            data.push(temp);
        }
        return data;
    }
}

module.exports = userLearningService;
