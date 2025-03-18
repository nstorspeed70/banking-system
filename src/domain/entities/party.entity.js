"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = exports.PartyRole = void 0;
var PartyRole;
(function (PartyRole) {
    PartyRole["ADMIN"] = "admin";
    PartyRole["EMPLOYEE"] = "employee";
    PartyRole["READONLY"] = "readonly";
})(PartyRole = exports.PartyRole || (exports.PartyRole = {}));
class Party {
    constructor(params) {
        var _a, _b, _c;
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.role = params.role;
        this.enterpriseId = params.enterpriseId;
        this.isActive = (_a = params.isActive) !== null && _a !== void 0 ? _a : true;
        this.createdAt = (_b = params.createdAt) !== null && _b !== void 0 ? _b : new Date();
        this.updatedAt = (_c = params.updatedAt) !== null && _c !== void 0 ? _c : new Date();
    }
}
exports.Party = Party;
