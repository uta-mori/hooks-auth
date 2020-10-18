import { useState, useEffect } from "react";
import { Question } from "../../models/Question";
import Layout from "../../components/Layout";
import { useAuthentication } from "../../hooks/authentication";
import * as firebase from "firebase/app";
import Link from 'next/link';

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const { user } = useAuthentication();

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }
    const loadQuestions = async () => {
      const snapshot = await firebase
        .firestore()
        .collection("questions")
        .where("receiverUid", "==", user.uid)
        .get();
      if (snapshot.empty) {
        return;
      }
      const gotQuestions = snapshot.docs.map((doc) => {
        const question = doc.data() as Question;
        question.id = doc.id;
        return question;
      });
      setQuestions(gotQuestions);
    };
    loadQuestions();
  }, [process.browser, user]);

  return (
    <Layout>
      <h1 className="h4"></h1>
      <Link href="/">
        <button>Go home</button>
      </Link>

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {questions.map((question) => (
            <div className="card my-3" key={question.id}>
              <div className="card-body">
                <div className="text-truncate">{question.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
