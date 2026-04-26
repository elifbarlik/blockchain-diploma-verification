import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { keccak256, toHex } from "viem";

describe("DiplomaVerification", async () => {
  it("should issue and verify a diploma", async () => {
    const { viem } = await network.connect();

    const diploma = await viem.deployContract("DiplomaVerification");

    const studentId = "20231234";
    const ipfsCid = "QmExampleCID";
    const diplomaHash = keccak256(toHex("Ahmet Yilmaz Diploma"));

    await diploma.write.issueDiploma([
      studentId,
      ipfsCid,
      diplomaHash,
    ]);

    const isValid = await diploma.read.verifyDiploma([diplomaHash]);

    assert.equal(isValid, true);
  });

  it("should revoke a diploma", async () => {
    const { viem } = await network.connect();

    const diploma = await viem.deployContract("DiplomaVerification");

    const studentId = "20231234";
    const ipfsCid = "QmExampleCID";
    const diplomaHash = keccak256(toHex("Ahmet Yilmaz Diploma"));

    await diploma.write.issueDiploma([
      studentId,
      ipfsCid,
      diplomaHash,
    ]);

    await diploma.write.revokeDiploma([diplomaHash]);

    const isValid = await diploma.read.verifyDiploma([diplomaHash]);

    assert.equal(isValid, false);
  });
});