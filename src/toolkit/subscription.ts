function Subscription(this: any) {
  this.listeners = [];
  this.subscribe = listener => {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.findIndex(d => d === listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  };
  this.publish = () => {
    this.listeners.forEach(listener => {
      listener();
    });
  };
}

export default Subscription;
