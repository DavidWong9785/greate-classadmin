'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Video = app.model.define('videos', {
        doc: { type: STRING(48), allowNull: false },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 节Id
        sectionId: { type: STRING(48), allowNull: false, primaryKey: true },
        videoName: STRING(200),
        chapterName: { type: STRING(100), allowNull: false },
        sectionName: { type: STRING(100), allowNull: false },
        cindex: { type: STRING(3), allowNull: false },
        sindex: { type: STRING(3), allowNull: false },
        created_at: DATE,
        updated_at: DATE,
    });

    Video.addVideoApply = async function(doc, courseId, sectionId, videoName, chapterName, sectionName, cindex, sindex) {
        const checkExist = await this.findOne({
            where: {
                sectionId,
            },
        });
        let p;
        if (checkExist != null || checkExist != undefined) {
            p = await this.update({
                videoName,
            }, {
                where: {
                    sectionId,
                },
            });
        } else {
            p = await this.create({
                doc,
                courseId,
                sectionId,
                videoName,
                chapterName,
                sectionName,
                cindex,
                sindex
            });
        }
        return p;
    };

    Video.removeVideoApply = async function(sectionId) {
        await this.destroy({
            where: {
                sectionId,
            },
        });
    };

    Video.getVideoApplyList = async function() {
        return await this.findAll();
    }

    return Video;
};
