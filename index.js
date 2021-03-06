#!/usr/bin/env node
//this makes the file executable 

// console.log('Yep, this works!')

const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const program = require("@caporal/core").default
const fs = require("fs")
const { spawn } = require('child_process')
var clc = require("cli-color");

//use the caporal package to build out our cli tool
program
    .version('1.0.0')
    .argument('[filename]', "This is the name of the file to be executed.")
    .action(async ({ filename, args }) => {
        //check if a filename is being provided
        const name = (args.filename) || "index.js"

        try {
            await fs.promises.access(name)
        } catch (err) {
            throw new Error(`Could not find the file: ${name}`)
        }

        //add a process variable 
        let proc;
        //this will start up a user's code 
        const start = debounce(() => {
            if (proc) {
                proc.kill()
            }
            console.log(clc.yellow(">>>>> Process started!"))
            proc = spawn('node', [name], { stdio: 'inherit' })
        }, 100)

            //have chokidar send messages depending on what event is detected in our working directory
            chokidar.watch('.')
            //add a timer for the event for for  100 milliseconds (debouncing) with lodash
                .on('add', start)
                .on('change', start)
                .on('unlink', start)
                    // console.log(args)
    })

program.run(process.argv.slice(2))

