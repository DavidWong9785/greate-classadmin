'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Watch = app.model.define('watches', {
        // 用户
        mail: { type: STRING(48), allowNull: false, primaryKey: true },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 节Id
        sectionId: { type: STRING(48), allowNull: false, primaryKey: true },
        point: STRING(5),
        created_at: DATE,
        updated_at: DATE,
    });

    Watch.removeBySectionId = async function(sectionId) {
        return await this.destroy({
            where: {
                sectionId,
            },
        });
    };

    return Watch;
};
