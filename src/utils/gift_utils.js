import GiftModel from '../models/GiftModel.js';
import crypto from 'crypto';

const generateGiftCode = () => {
    return crypto.randomBytes(8).toString('hex').toUpperCase(); // Gera um código de gift único
};

const createGift = async (creditAmount, createdByUserId) => {
    try {
        // Gera um código de gift único
        const code = generateGiftCode();

        // Verifica se o gift já existe
        const existingGift = await GiftModel.findOne({ code });
        if (existingGift) {
            throw new Error('O código do gift já existe');
        }

        // Cria um novo gift
        const newGift = new GiftModel({
            code,
            used: false,
            creditAmount,
            createdBy: createdByUserId, // ID do usuário que criou o gift
        });

        await newGift.save();
     //   console.log('Gift criado com sucesso:', newGift);
        return newGift;
    } catch (error) {
        console.error('Erro ao criar gift:', error);
        throw error;
    }
};

export default createGift
