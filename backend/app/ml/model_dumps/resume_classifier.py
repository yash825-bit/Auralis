import pickle
import pandas as pd
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import ComplementNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MaxAbsScaler
from sklearn.feature_selection import SelectKBest

df = pd.read_csv("../datasets/ResumeDataSet.csv")

x: List[str] = df['Resume'].astype(str).tolist()
y: List[str] = df['Category'].tolist()

model = Pipeline([
        ('tfidf', TfidfVectorizer(encoding='utf-8', decode_error='ignore', lowercase=True,
                                  stop_words='english', token_pattern=r'(?u)\b[a-zA-Z]{2,}\b')),
        ('scale', MaxAbsScaler()),
        ('select', SelectKBest(k=5000)),
        ('model', ComplementNB())
    ])

model.fit(x, y)

with open("../models/resume_classifier_cnb.pkl", "wb") as f:
    pickle.dump(model, f)
