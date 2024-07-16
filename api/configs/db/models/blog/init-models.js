let _user = require("./user.model")
let _role = require("./role.model")
let _user_role = require("./user_role.model")
let _category = require("./category.model")
let _article = require("./article.model")
let _article_tag = require("./article_tag.model")
let _tag = require("./tag.model")

function initModels(dbInstance, Sequelize) {

    //---> user
    let user = _user(dbInstance, Sequelize)
    let role = _role(dbInstance, Sequelize)
    let user_role = _user_role(dbInstance, Sequelize)
    let category = _category(dbInstance, Sequelize)
    let article = _article(dbInstance, Sequelize)
    let article_tag = _article_tag(dbInstance, Sequelize)
    let tag = _tag(dbInstance, Sequelize)

    user.belongsToMany(role, { through: user_role, foreignKey: 'user_id', otherKey: 'role_id' })
    role.belongsToMany(user, { through: user_role, foreignKey: 'role_id', otherKey: 'user_id' })
    
    user_role.belongsTo(user, { foreignKey: 'user_id' })
    user_role.belongsTo(role, { foreignKey: 'role_id' })

    article.belongsTo(category, { as: "category", foreignKey: "category_id"});
    category.hasMany(article, { as: "articles", foreignKey: "category_id"});

    article.belongsTo(user, { as: "author", foreignKey: "author_id"})
    user.hasMany(article, { as: "articles", foreignKey: "author_id"})

    article_tag.belongsTo(article, { as: "article", foreignKey: "article_id"});
    article.hasMany(article_tag, { as: "article_tags", foreignKey: "article_id"});

    article_tag.belongsTo(tag, { as: "tag", foreignKey: "tag_id"});
    tag.hasMany(article_tag, { as: "article_tags", foreignKey: "tag_id"});

    return {
        user,
        role,
        user_role,
        category,
        article,
        article_tag,
        tag
    };
}
module.exports = initModels;

