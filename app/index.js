'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const body_parser_1 = __importDefault(require("body-parser"));
const conf_json_1 = __importDefault(require("./conf.json"));
const router_1 = __importDefault(require("./router"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
router_1.default(app);
app.listen(conf_json_1.default.port, (err) => {
    if (err) {
        console.error('Server does not start: ', err);
    }
    console.log(`Server is listening on ${conf_json_1.default.port}`);
});
