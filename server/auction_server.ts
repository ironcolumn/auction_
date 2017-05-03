/**
 * Created by Administrator on 2017/5/3.
 */
import * as express from 'express';
const app = express();
export class Product {
    constructor(public id: number,
                public title: string,
                public price: number,
                public rating: number,
                public desc: string,
                public categories: Array<string>) {
    }
}
export class Comment {
    constructor(public id: number,
                public productId: number,
                public timestamp: string,
                public user: string,
                public rating: number,
                public content: string) {

    }
}
const products: Product[] = [
    new Product(1, '第一个商品', 1.99, 4.5, '这是一个商品,后面是一段话', ['电子商务']),
    new Product(2, '第二个商品', 4.99, 2.5, '这是一个商品,后面是一段话', ['项目实战']),
    new Product(3, '第三个商品', 2.99, 1.5, '这是一个商品,后面是一段话', ['电子商务', '图书']),
    new Product(4, '第四个商品', 4.99, 2.5, '这是一个商品,后面是一段话', ['硬件设备', '项目实战']),
    new Product(5, '第五个商品', 3.99, 3.0, '这是一个商品,后面是一段话', ['电子商务', '项目实战']),
    new Product(6, '第六个商品', 2.99, 4.0, '这是一个sss商品,后面是一段话', ['图书', '项目实战'])
];

const comments: Comment[] = [
    new Comment(1, 1, '2017-02-02 22:22:22', '张三', 3, '东西不错'),
    new Comment(2, 1, '2017-02-02 22:22:22', '张三', 2, '东西不错'),
    new Comment(3, 1, '2017-02-02 22:22:22', '张四', 4, '东西不错'),
    new Comment(4, 2, '2017-02-02 22:22:22', '张五', 3, '东西不错'),
    new Comment(5, 3, '2017-02-02 22:22:22', '张三', 5, '东西不错'),
    new Comment(6, 2, '2017-02-02 22:22:22', '李三', 4, '东西不错'),
    new Comment(7, 3, '2017-02-02 22:22:22', '张三', 3, '东西不错222')
];
app.get('/api', (req, res) => {
    res.send("Hello Express");
});
app.get('/api/products', (req, res) => {
    let result = products;
    let params = req.query;
    console.log(params);
    if (params.title) {
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }
    if (params.price && result.length > 0) {
        result = result.filter((p) => p.price <= parseInt(params.price));
    }
    if (params.category !== "-1" && result.length > 0) {
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }
    res.json(result);
});
app.get('/api/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});
app.get('/api/product/:id/comments', (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});
const server = app.listen(8000, "localhost", () => {
    console.log("服务器已启动,地址是:http://localhost:8000/");
});