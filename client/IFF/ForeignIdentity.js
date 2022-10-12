class ForeignIdentity{

    #identity;

    constructor(identity){
        this.#identity = identity;
    }

    display(){ return {
        identity: this.#identity,
    } }

    update({ }){
    }

}

export default ForeignIdentity;
