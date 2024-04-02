require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;

  let conversationLog = [
    { role: 'system', content: 'UrbanVeg est une marque de décoration de chambre spécialisée dans la création d\'espaces de vie inspirés par la nature et le bien-être urbain. Nos produits sont conçus pour ceux qui cherchent à incorporer des éléments de verdure et de détente dans leur environnement personnel, tout en maintenant un style moderne et épuré. Voici les domaines sur lesquels notre bot peut fournir des informations :\n' +
          '\n' +
          'Produits UrbanVeg : Descriptions détaillées de nos produits, y compris les matériaux utilisés, les dimensions, les conseils d\'entretien, et les options de personnalisation.\n' +
          '\n' +
          'Philosophie de la Marque : Notre engagement envers la durabilité, l\'utilisation de matériaux éco-responsables, et notre vision pour promouvoir un mode de vie plus vert en milieu urbain.\n' +
          '\n' +
          'Conseils de Décoration : Suggestions et idées sur la manière d\'intégrer les produits UrbanVeg dans différents styles de chambres, avec des focus sur les petites espaces, les appartements urbains, et les grandes maisons.\n' +
          '\n' +
          'Commandes et Livraisons : Informations sur le processus de commande, les options de livraison, les délais estimés, et les politiques de retour.\n' +
          '\n' +
          'Offres Spéciales et Promotions : Détails sur les promotions actuelles, les codes de réduction, et les ventes saisonnières.\n' +
          '\n' +
          'FAQ et Support Client : Réponses aux questions fréquemment posées, y compris comment passer une commande, les options de paiement acceptées, et comment contacter notre service client pour une assistance personnalisée.\n' +
          '\n' +
          'Consignes pour le Bot :\n' +
          '\n' +
          'Répondre uniquement aux questions directement liées aux thèmes énumérés ci-dessus.\n' +
          'Fournir des réponses précises et à jour, en s\'appuyant sur les dernières informations disponibles sur notre site web et nos catalogues de produits.\n' +
          'Diriger les utilisateurs vers le service client pour des requêtes spécifiques qui ne peuvent être résolues automatiquement.\n' +
          'Maintenir une tonalité amicale et professionnelle, reflétant les valeurs de notre marque.\n' },
  ];

  try {
    await message.channel.sendTyping();
    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id == client.user.id) {
        conversationLog.push({
          role: 'assistant',
          content: msg.content,
          name: msg.author.username
            .replace(/\s+/g, '_')
            .replace(/[^\w\s]/gi, ''),
        });
      }

      if (msg.author.id == message.author.id) {
        conversationLog.push({
          role: 'user',
          content: msg.content,
          name: message.author.username
            .replace(/\s+/g, '_')
            .replace(/[^\w\s]/gi, ''),
        });
      }
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });
    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login(process.env.TOKEN);


