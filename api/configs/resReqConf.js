const express = require('express')
const nocache = require('nocache')


exports.setupBasics = (app) => {

    app.use(express.urlencoded({ extended: true, limit: '10mb'}))
    app.use(express.json({ limit: '10mb' }))
    app.disable('etag')
    app.set('trust proxy', true)
    app.use(nocache())
}