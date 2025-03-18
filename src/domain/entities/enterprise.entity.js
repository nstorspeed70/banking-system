"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enterprise = exports.EnterpriseType = void 0;
var EnterpriseType;
(function (EnterpriseType) {
    EnterpriseType["COMPANY"] = "company";
    EnterpriseType["INDIVIDUAL"] = "individual";
})(EnterpriseType = exports.EnterpriseType || (exports.EnterpriseType = {}));
class Enterprise {
    constructor(params) {
        var _a, _b, _c;
        this.id = params.id;
        this.legalBusinessName = params.legalBusinessName;
        this.taxId = params.taxId;
        this.enterpriseType = params.enterpriseType;
        this.contactEmail = params.contactEmail;
        this.contactPhone = params.contactPhone;
        this.isActive = (_a = params.isActive) !== null && _a !== void 0 ? _a : true;
        this.createdAt = (_b = params.createdAt) !== null && _b !== void 0 ? _b : new Date();
        this.updatedAt = (_c = params.updatedAt) !== null && _c !== void 0 ? _c : new Date();
    }
}
exports.Enterprise = Enterprise;
