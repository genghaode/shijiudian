## 用户表：User
- id 用户id type:ObjectId
- mobile 用户手机号  type:String
- password 用户密码 type:String
- name 用户名 type:String
- avatar 用户头像 type:String

## token表：Token
- id token id type:String
- user 用户表引用 type:ObjectId ref:'User'
- token 值 type:String
- expire: 过期时间 type:Date

## 文章表：Item
- id 文章id type:ObjectId
- category 分类表引用 type:ObjectId ref:'Category'
- title 文章标题 type:String
- author 作者 type:String
- content 正文 type:[String]
- create_time 创建时间 type:Date
- image 缩略图 type:String

## 分类表：Category
- id 分类id type:ObjectId
- name 分类名 type:String
- image 分类图标 type:String

## 收藏表：Collection
- id 收藏id type:ObjectId
- item 文章表引用 type:ObjectId ref:'Item'
- user 用户表引用 type:ObjectId ref: 'User'

## 轮播图表：Banner
- id 轮播图id type:ObjectId
- weight 权重 type:Number
- image 显示的图片 type:String
- url 点击时跳转的链接 type:String

