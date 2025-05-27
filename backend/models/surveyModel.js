const mongoose = require('mongoose');

const surveySchema = mongoose.Schema(
  {
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    user_id: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    creationTime: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Survey', surveySchema);
