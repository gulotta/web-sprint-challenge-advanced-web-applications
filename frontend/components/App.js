import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import axios from '../axios'
import axiosWithAuth from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState(null)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") };
  const redirectToArticles = () => { navigate("/articles") };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage("Goodbye!");
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {

    setMessage("");

    setSpinnerOn(true);

    axios()
    .post(loginUrl, {username, password})
    .then((res) => {
      console.log(res)
      window.localStorage.setItem('token', res.data.token);
      setMessage(res.data.message);
      redirectToArticles();
    })
    .catch((err) => {
        setMessage(err.res.data.message)
      })
    .finally(() => {
      setSpinnerOn(false)
    })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  // const getArticles = () => {
  //   // ✨ implement
  //   // We should flush the message state, turn on the spinner
  //   setMessage("");
  //   setSpinnerOn(true);
  //   // and launch an authenticated request to the proper endpoint.
  //   axios()
  //   .get(articlesUrl)
    
  //   // On success, we should set the articles in their proper state and
  //   // put the server success message in its proper state.
  //   .then((res) => {
  //     console.log(res.data)
  //     // setArticles(res.data.articles)
  //     setMessage(res.data.message)
  //   // If something goes wrong, check the status of the response:
  //   .catch((err) => {
  //     console.error(err.res)
  //   // if it's a 401 the token might have gone bad, and we should redirect to login.
  //   // err.res.status === 401 ?
  //   //   redirectToLogin() :
  //   //   setMessage(err.res.data.message)
  //   })
  //   // Don't forget to turn off the spinner!
  //   .finally(() => {
  //     setSpinnerOn(false)
  //   })
  // })
  // }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(true)
    setMessage('')
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setMessage(res.data.message)
        setArticles(res.data.articles)
      }).catch(err => {
        setMessage(err?.response?.data?.message || 'Something bad happened')
        if (err.response.status == 401) {
          redirectToLogin()
        }
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    console.log(article)
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth()
    .post(articlesUrl, article)
    .then((res) => {
      setArticles(articles => {
        return articles.concat(res.data.article)
      })
      setMessage(res.data.message)
    })
    .catch((err) => {
      console.error(err)
      err.res.status === 401 ?
      redirectToLogin() :
      setMessage(err.res.data.message)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!
    axiosWithAuth()
    .put(`http://localhost:9000/api/articles/${article_id}`, article)
    .then(res => {
      setMessage(res.data.message)
      const newArticle = articles.filter(art => art.article_id !== res.data.article.article_id)
      setArticles(articles => {
        return articles.map(art => {
          return art.article_id === article_id ? res.data.article : art
        })
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    console.log(article_id)
    setSpinnerOn(true)
    axiosWithAuth()
    .delete(`http://localhost:9000/api/articles/${article_id}`)
    .then(res => {
      setMessage(res.data.message)
      setArticles(articles => {
        return articles.filter(art => {
          return art.article_id != article_id
        
        })
      })
    })
    .catch(err => {
      console.error(err)
    })
    setSpinnerOn(false)
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle = {postArticle} 
              updateArticle = {updateArticle}
              setCurrentArticleId = {setCurrentArticleId}
              currentArticle = {currentArticle}
              currentArticleId= {currentArticleId}
              setCurrentArticle = {setCurrentArticle}
              />
              <Articles
              setSpinnerOn={setSpinnerOn}
              getArticles={getArticles}
              articles= {articles}
              deleteArticle={deleteArticle}
              setCurrentArticle={setCurrentArticle}
              currentArticle={currentArticle}
              currentArticleId={currentArticleId}
              setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
