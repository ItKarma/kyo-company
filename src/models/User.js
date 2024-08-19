import { model, Schema } from "mongoose";

// Subschema for Subscription details
const SubscriptionSchema = new Schema({
    plan: {
        type: String,
        enum: ['Free', 'Basic', 'Plus', 'Premium'],
        required: true,
        default: 'Free'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        // Para o plano Free, endDate será null, pois é indefinido
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const UserModel = new Schema({
    first_name: {
        type: String,
    },
    idUser: {
        type: Number,
    },
    username: {
        type: String,
    },
    balance: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: SubscriptionSchema,
        default: {
            plan: 'Free',
            startDate: Date.now(),
            status: 'active',
            endDate: null
        }
    }
});

// Function to calculate end date based on plan
UserModel.methods.calculateEndDate = function(plan) {
    if (plan === 'Free') {
        this.subscription.endDate = null; // Free não tem data de término
    } else {
        let days;
        switch (plan) {
            case 'Basic':
                days = 1;
                break;
            case 'Plus':
                days = 7;
                break;
            case 'Premium':
                days = 30;
                break;
            default:
                throw new Error('Invalid plan');
        }
        this.subscription.endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    return this.subscription.endDate;
};

const userModel = model('users', UserModel);
export default userModel;
