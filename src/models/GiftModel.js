import { model, Schema } from "mongoose";

const GiftSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    creditAmount: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId, // Referência ao ID do usuário que criou o gift
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    redeemedBy: {
        type: Schema.Types.ObjectId, // Referência ao ID do usuário que resgatou o gift
        ref: 'User', // Nome do modelo User
        default: null, // Pode ser null se o gift ainda não foi resgatado
    },
});

const GiftModel = model('Gift', GiftSchema);

export default GiftModel;
