import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { User } from "../../models/User";
import * as firebase from "firebase/app";
import "../../components/Layout"
import Layout from "../../components/Layout";

export default function UserShow() {
  const [user, setUser] = useState<User>(null);
  const [body, setBody] = useState('')
  const router = useRouter();
  const query = router.query as Query;

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }
    async function loadUser() {
      const doc = await firebase
        .firestore()
        .collection("users")
        .doc(query.uid)
        .get();
      if (!doc.exists) {
        return;
      }
      const gotUser = doc.data() as User;
      gotUser.uid = doc.id;
      setUser(gotUser);
    }
    loadUser();
  }, [query.uid]);

  async function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault

    await firebase.firestore().collection('questions').add({
      senderUid: firebase.auth().currentUser.uid,
      recieveUid: user.uid,
      body,
      isRelied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setBody('')
    alert('質問を投稿しました')
  }

  return (
    <Layout>
      {user && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <div className="m-5">{user.name}さんに質問しよう！</div>
          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-6">
              <form onSubmit={onSubmit}>
                <textarea
                  className="form-control"
                  placeholder="おげんきですか？"
                  value={body}
                  onChange={(e)=>setBody(e.target.value)}
                  rows={6}
                  required
                ></textarea>
                <div className="m-3">
                  <button type="submit" className="btn btn-primary">
                    質問を送信する
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

type Query = {
  uid: string;
};


