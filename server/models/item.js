'use strict';

module.exports = (Item) => {

    Item.increase = (id, increase, callback) => {
        // Start the transaction
        Item.beginTransaction({
            isolationLevel: Item.Transaction.READ_COMMITTED,
        }, (err, tx) => {
            // Retrieve the current counter value as part of the transaction
            Item.findById(id, {
                transaction: tx,
            }, (err, item) => {
                if (err) {
                    console.log(err);
                    return tx.rollback((err) => {
                        callback(err);
                    });
                }

                // Increment the count as part of the transaction
                var inc = item.count + increase;

                if(inc < 0) {
                    return callback("You can not have products in negative quantities")
                }

                Item.app.models.Product.findById(item.productId, {
                    transaction: tx,
                }, (err, prod) => {

                    if(err) {
                        console.log(err);
                        tx.rollback((err) => {
                            callback(err);
                        });
                    }
                    if(prod.stockamount >= increase) {
                        updateItem(item, prod, increase, tx, callback);
                    } else {
                        callback("There is no stock available");
                    }
                });

            });
        });
    };

    Item.postItem = (data, req, callback) => {
        // Start the transaction
        Item.beginTransaction({
            isolationLevel: Item.Transaction.READ_COMMITTED,
        }, (err, tx) => {

            Item.app.models.Product.findById(data.productId, {
                transaction: tx,
            }, (err, prod) => {
                if(err) {
                    console.log(err);
                    tx.rollback((err) => {
                        callback(err);
                    });
                }
                if(prod.stockamount >= data.count) {
                    Item.create(data, {
                        transaction: tx,
                    }, (err, item) => {

                        if(err) {
                            console.log(err);
                            tx.rollback((err) => {
                                callback(err);
                            });
                        }

                        updateProduct(prod, data.count, data.count, tx, callback);
                    })
                } else {
                    callback("There is no stock available");
                }
            });


        });
    }

    Item.remoteMethod('increase', {
        accepts: [
            { arg: 'id', type: 'number', description: 'Item id', required: true, http: { source: 'path' } },
            { arg: 'count', type: 'number', http: { source: 'body' } }
        ],
        returns: { arg: 'count', type: 'number' },
        http: { path: '/:id/count', verb: 'patch' }
    });

    Item.remoteMethod('postItem', {
        accepts: [
            { arg: 'data', type: 'object', http: { source: 'body' } },
            { arg: 'req', type: 'object', 'http': { source: 'req' } }
        ],
        returns: { arg: 'response', type: 'string', root: true },
        http: { path: '//', verb: 'POST' }
    });
};



function updateItem(item, prod, inc, tx, callback) {
    let itemTotal = item.count + inc;
    item.updateAttributes({
        count: itemTotal,
    }, {
            transaction: tx,
        }, (err, newData) => {
            if (err) {
                console.log(err);
                return tx.rollback((err) => {
                    callback(err);
                });
            }
            updateProduct(prod, itemTotal, inc, tx, callback)
        });
}


function updateProduct(prod, itemTotal, increase, tx, callback) {
    prod.updateAttributes({
        stockamount: prod.stockamount - increase,
    }, {
            transaction: tx,
        }, (err, newData) => {
            if (err) {
                console.log(err);
                return tx.rollback((err) => {
                    callback(err);
                });
            }
            // Commit the transaction to make it happen
            tx.commit((err) => {
                if (err)
                    return callback(err);
                // count should have been incremented
                callback(null, itemTotal);
            });
        });
}

