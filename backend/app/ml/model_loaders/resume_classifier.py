import pickle

with open("resume_classifier_cnb.pkl", "rb") as f:
    model = pickle.load(f)

resume_text = """Experience in Python, ML, Pandas, NumPy, TensorFlow ..."""

prediction = model.predict([resume_text])[0]
probabilities = model.predict_proba([resume_text])
