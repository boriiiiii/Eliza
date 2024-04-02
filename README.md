# GPT 3.5 Turbo Chat Bot

This is a simple Discord chat bot built using discord.js and the gpt-3.5-turbo model from Open AI. This is the same model used for the popular chatbot Chat GPT.

A full video tutorial for this chat bot can be found [here](https://youtu.be/CB76_GDrPsE)

## How to setup

1. Clone the repository to the current directory

```powershell
git clone git@github.com:boriiiiii/Eliza.git .
```

2. Install all the dependencies

- Using npm
```powershell
npm i
```

- Using yarn
```powershell
yarn
```

3. Create a new file called `.env` and copy the format from `.env.example` (or you can just rename `.env.example`)

4. create `.env` with your own credentials, create next variables :
        TOKEN (discord token),
        API_KEY (openai api key),
        CHANNEL_ID (discord text channel id)

5. Start your bot

- Using npm
```powershell
npm run start
```

- Using yarn
```powershell
yarn start
```
