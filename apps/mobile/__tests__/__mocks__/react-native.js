module.exports = {
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
};
