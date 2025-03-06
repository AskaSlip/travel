interface GoogleAccounts {
  accounts: {
    id: {
      disableAutoSelect: () => void;
      revoke: (hint: string, callback: () => void) => void;
    };
  };
}

interface Window {
  google?: GoogleAccounts;
}
