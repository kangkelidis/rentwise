import mongoose from 'mongoose'
import { autoIncrement } from 'mongoose-plugin-autoinc';

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },

})

ownerSchema.plugin(autoIncrement, { model: 'Owner', field: 'number' });

export default mongoose.models.Owner || mongoose.model('Owner', ownerSchema)

