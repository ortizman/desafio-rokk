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

                item.updateAttributes({
                    count: inc,
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
                            if (err) return callback(err);
                            // count should have been incremented
                            callback(null, item.count);
                        });
                    });
            });
        });
    };

    Item.remoteMethod('increase', {
        accepts: [
            { arg: 'id', type: 'number', description: 'Item id', required: true, http: { source: 'path' } },
            { arg: 'count', type: 'number', http: { source: 'body' } }
        ],
        returns: { arg: 'count', type: 'number' },
        http: { path: '/:id/increase', verb: 'patch' }
    });
};
