module.exports = {
  name: 'ready',
  once: true,
  async run(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};