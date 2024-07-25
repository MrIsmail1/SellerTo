const stripe = {
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
  refunds: {
    create: vi.fn(),
  },
};

export default stripe;
