class Receipt {
    constructor() {
        this.creationDate = new Date();
        this.products = [];

        this.payment = [];
    }

    get subtotal() {
        return this.total - this.paid;
    }

    get due() {
        if(this.paid < 1) return 0;
        return Math.abs(Math.max(this.total - this.paid, 0));
    }

    get paid() {
        let total = 0;
        for (let i = 0; i < this.payment.length; i++)
            total += this.payment[i].amount;
        return total;
    }

    pay(method, amount) {
        this.payment.push({
            method,
            amount
        })
    }

    addProduct(product) {
        let pr = this.products.find(p => p.id == product.id);

        if(!pr) {
            this.products.push(product);
            return product;
        } else
            pr.quantity += product.quantity;
        return pr;
    }

    voidProduct(product) {
        let pr = this.products.find(p => p.id == product.id);

        if(pr)
            pr.void = true;
    }

    get total() {
        let total = 0;
        for (let i = 0; i < this.products.length; i++) {
            if(!this.products[i].void)
                total += this.products[i].getPriceWithVAT();
        }
        return total;
    }
}

export default Receipt;