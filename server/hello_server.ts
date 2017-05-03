/**
 * Created by Administrator on 2017/5/3.
 */
import * as http from 'http'
const server = http.createServer((request, response) => {
    response.end("Hello Node!");
});
server.listen(8000);