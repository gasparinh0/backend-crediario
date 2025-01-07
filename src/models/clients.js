import { Schema, model } from 'mongoose'

const schema = new Schema({
    name: { type: String, required: true },
    telephone: { type: String, required: true },
})

const ClientModel = model('clients', schema)

export default ClientModel