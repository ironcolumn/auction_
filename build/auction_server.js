"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 2017/5/3.
 */
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '第一个商品', 1.99, 4.5, '这是一个商品,后面是一段话', ['电子商务']),
    new Product(2, '第二个商品', 4.99, 2.5, '这是一个商品,后面是一段话', ['项目实战']),
    new Product(3, '第三个商品', 2.99, 1.5, '这是一个商品,后面是一段话', ['电子商务', '图书']),
    new Product(4, '第四个商品', 4.99, 2.5, '这是一个商品,后面是一段话', ['硬件设备', '项目实战']),
    new Product(5, '第五个商品', 3.99, 3.0, '这是一个商品,后面是一段话', ['电子商务', '项目实战']),
    new Product(6, '第六个商品', 2.99, 4.0, '这是一个sss商品,后面是一段话', ['图书', '项目实战'])
];
var comments = [
    new Comment(1, 1, '2017-02-02 22:22:22', '张三', 3, '东西不错'),
    new Comment(2, 1, '2017-02-02 22:22:22', '张三', 2, '东西不错'),
    new Comment(3, 1, '2017-02-02 22:22:22', '张四', 4, '东西不错'),
    new Comment(4, 2, '2017-02-02 22:22:22', '张五', 3, '东西不错'),
    new Comment(5, 3, '2017-02-02 22:22:22', '张三', 5, '东西不错'),
    new Comment(6, 2, '2017-02-02 22:22:22', '李三', 4, '东西不错'),
    new Comment(7, 3, '2017-02-02 22:22:22', '张三', 3, '东西不错222')
];
app.get('/api', function (req, res) {
    res.send("Hello Express");
});
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    console.log(params);
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动,地址是:http://localhost:8000/");
});
var subscripitions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (WebSocket) {
    WebSocket.send("这个消息是服务器主动推送的");
    WebSocket.on('message', function (message) {
        var messageObj = JSON.parse(message);
        console.log("接收到消息:" + messageObj);
        var productIds = subscripitions.get(WebSocket) || [];
        subscripitions.set(WebSocket, productIds.concat([messageObj.productId]));
        console.log(productIds);
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscripitions.forEach(function (productIds, ws) {
        var newBids = productIds.map(function (pid) { return ({
            productId: pid,
            bid: currentBids.get(pid)
        }); });
        ws.send(JSON.stringify(newBids));
    });
}, 2000);
