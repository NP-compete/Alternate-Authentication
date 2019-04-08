# Copyright BigchainDB GmbH and BigchainDB contributors
# SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
# Code is Apache-2.0 and docs are CC-BY-4.0

from bigchaindb.common.exceptions import (InvalidSignature,
                                          DuplicateTransaction)
from bigchaindb.common.transaction import Transaction
from bigchaindb.common.utils import (validate_txn_obj, validate_key)
from bigchaindb.common.schema import validate_transaction_schema
from bigchaindb.backend.schema import validate_language_key


class Transaction(Transaction):

    def validate(self, bigchain, current_transactions=[]):
        """Validate transaction spend
        Args:
            bigchain (BigchainDB): an instantiated bigchaindb.BigchainDB object.
        Returns:
            The transaction (Transaction) if the transaction is valid else it
            raises an exception describing the reason why the transaction is
            invalid.
        Raises:
            ValidationError: If the transaction is invalid
        """
        input_conditions = []

        if self.operation == Transaction.CREATE:
            duplicates = any(txn for txn in current_transactions if txn.id == self.id)
            if bigchain.is_committed(self.id) or duplicates:
                raise DuplicateTransaction('transaction `{}` already exists'
                                           .format(self.id))

            if not self.inputs_valid(input_conditions):
                raise InvalidSignature('Transaction signature is invalid.')

        elif self.operation == Transaction.TRANSFER:
            self.validate_transfer_inputs(bigchain, current_transactions)

        return self

    @classmethod
    def from_dict(cls, tx_body):
        return super().from_dict(tx_body, False)

    @classmethod
    def validate_schema(cls, tx_body):
        validate_transaction_schema(tx_body)
        validate_txn_obj('asset', tx_body['asset'], 'data', validate_key)
        validate_txn_obj('metadata', tx_body, 'metadata', validate_key)
        validate_language_key(tx_body['asset'], 'data')
        validate_language_key(tx_body, 'metadata')


class FastTransaction:
    """A minimal wrapper around a transaction dictionary. This is useful for
    when validation is not required but a routine expects something that looks
    like a transaction, for example during block creation.

    Note: immutability could also be provided
    """

    def __init__(self, tx_dict):
        self.data = tx_dict

    @property
    def id(self):
        return self.data['id']

    def to_dict(self):
        return self.data
