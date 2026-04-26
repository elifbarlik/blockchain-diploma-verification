// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiplomaVerification {

    address public owner;

    struct Diploma {
        string studentId;
        string ipfsCid;
        bytes32 diplomaHash;
        bool isValid;
    }

    mapping(bytes32 => Diploma) public diplomas;

    constructor() {
        owner = msg.sender;
    }

    function issueDiploma(
        string memory _studentId,
        string memory _ipfsCid,
        bytes32 _diplomaHash
    ) public {
        require(msg.sender == owner, "Only owner can issue");

        diplomas[_diplomaHash] = Diploma(
            _studentId,
            _ipfsCid,
            _diplomaHash,
            true
        );
    }

    function verifyDiploma(bytes32 _diplomaHash)
        public
        view
        returns (bool)
    {
        return diplomas[_diplomaHash].isValid;
    }

    function revokeDiploma(bytes32 _diplomaHash) public {
        require(msg.sender == owner, "Only owner can revoke");

        diplomas[_diplomaHash].isValid = false;
    }
}