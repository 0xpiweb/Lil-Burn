import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAddress, parseEther } from "viem";

describe("WarChest", async () => {
  const { viem, networkHelpers } = await network.connect();

  const publicClient = await viem.getPublicClient();

  const EPOCH_DURATION = 90 * 24 * 60 * 60;

  enum Error {
    OwnableUnauthorizedAccount = "OwnableUnauthorizedAccount",
    InsufficientDonation = "InsufficientDonation",
    WithdrawFailed = "WithdrawFailed",
    NothingToWithdraw = "NothingToWithdraw",
    EnforcedPause = "EnforcedPause",
  }

  async function deployFixture() {
    const [owner, donor1, donor2, donor3] = await viem.getWalletClients();

    const warChest = await viem.deployContract("WarChest", [
      owner.account.address,
    ]);

    return { warChest, owner, donor1, donor2, donor3 };
  }

  describe("Constants and initial state", async () => {
    it("MIN_DONATION is 0.1 ether", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const minDonation = await warChest.read.MIN_DONATION();

      assert.equal(minDonation, parseEther("0.1"));
    });

    it("EPOCH_DURATION is 90 days", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const epochDuration = await warChest.read.EPOCH_DURATION();

      assert.equal(epochDuration, BigInt(EPOCH_DURATION));
    });

    it("startTimestamp is set at deployment", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const startTimestamp = await warChest.read.startTimestamp();

      assert.ok(startTimestamp > 0n);
    });

    it("Initial currentEpoch is 1", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const currentEpoch = await warChest.read.currentEpoch();

      assert.equal(currentEpoch, 1n);
    });

    it("nextEpochStart is startTimestamp + EPOCH_DURATION", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const [startTimestamp, epochDuration, nextEpochStart] = await Promise.all(
        [
          warChest.read.startTimestamp(),
          warChest.read.EPOCH_DURATION(),
          warChest.read.nextEpochStart(),
        ],
      );

      assert.equal(nextEpochStart, startTimestamp + epochDuration);
    });

    it("nextEpochStart advances by EPOCH_DURATION each epoch", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const [epochDuration, first] = await Promise.all([
        warChest.read.EPOCH_DURATION(),
        warChest.read.nextEpochStart(),
      ]);

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      const second = await warChest.read.nextEpochStart();

      assert.equal(second, first + epochDuration);
    });

    it("Owner is set correctly", async () => {
      const { warChest, owner } =
        await networkHelpers.loadFixture(deployFixture);

      const _owner = await warChest.read.owner();

      assert.equal(_owner, getAddress(owner.account.address));
    });
  });

  describe("Donations and transfers", async () => {
    it("Anyone can donate", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("1"));
    });

    it("Anyone can transfer", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("1"));
    });

    it("Multiple donations from the same address accumulate in balance", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("2"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("3"));
    });

    it("Multiple transfers from the same address accumulate in balance", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("2"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("3"));
    });

    it("Multiple donors accumulate in balance", async () => {
      const { warChest, donor1, donor2, donor3 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await warChest.write.donate({
        account: donor2.account,
        value: parseEther("2"),
      });

      await warChest.write.donate({
        account: donor3.account,
        value: parseEther("3"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("6"));
    });

    it("Emits Donated event with correct args when donating", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      const hash = await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await warChest.getEvents.Donated();

      const {
        args: { donor, epoch, amount },
      } = events[0];

      assert.equal(events.length, 1);
      assert.equal(donor, getAddress(donor1.account.address));
      assert.equal(epoch, 1n);
      assert.equal(amount, parseEther("1"));
    });

    it("Emits Donated event with correct args when transferring", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      const hash = await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await warChest.getEvents.Donated();

      const {
        args: { donor, epoch, amount },
      } = events[0];

      assert.equal(events.length, 1);
      assert.equal(donor, getAddress(donor1.account.address));
      assert.equal(epoch, 1n);
      assert.equal(amount, parseEther("1"));
    });

    it("Revert when donation is below MIN_DONATION", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        warChest.write.donate({
          account: warChest.address,
          value: parseEther("0.01"),
        }),
        warChest,
        Error.InsufficientDonation,
      );
    });

    it("Revert when transfer value is below MIN_DONATION", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        donor1.sendTransaction({
          to: warChest.address,
          value: parseEther("0.01"),
        }),
        warChest,
        Error.InsufficientDonation,
      );
    });
  });

  describe("Epoch calculation", async () => {
    it("Epoch increases every 90 days", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      let currentEpoch = await warChest.read.currentEpoch();

      for (let i = 0; i < 10; ++i) {
        await networkHelpers.time.increase(
          networkHelpers.time.duration.days(89),
        );

        const epochBefore = await warChest.read.currentEpoch();

        assert.equal(epochBefore, currentEpoch);

        await networkHelpers.time.increase(
          networkHelpers.time.duration.days(1),
        );

        const epochAfter = await warChest.read.currentEpoch();

        assert.equal(epochAfter, currentEpoch + 1n);

        currentEpoch = currentEpoch + 1n;
      }
    });
  });

  describe("Multi-epoch donations", async () => {
    it("Donated event includes correct epoch after time passes", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await networkHelpers.time.increase(
        networkHelpers.time.duration.days(180),
      );

      const hash = await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await warChest.getEvents.Donated();

      const {
        args: { epoch },
      } = events[0];

      assert.equal(events.length, 1);
      assert.equal(epoch, 3n);
    });

    it("Donations across epochs accumulate in balance", async () => {
      const { warChest, donor1, donor2 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      await warChest.write.donate({
        account: donor2.account,
        value: parseEther("5"),
      });

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("3"),
      });

      await warChest.write.donate({
        account: donor2.account,
        value: parseEther("4"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("13"));
    });
  });

  describe("Withdrawal", async () => {
    it("Owner can withdraw", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("10"),
      });

      const ownerBalanceBefore = await publicClient.getBalance({
        address: owner.account.address,
      });

      const hash = await warChest.write.withdraw();

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice;

      const ownerBalanceAfter = await publicClient.getBalance({
        address: owner.account.address,
      });

      assert.equal(
        ownerBalanceAfter,
        ownerBalanceBefore + parseEther("10") - gasUsed,
      );

      const contractBalance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(contractBalance, 0n);
    });

    it("Non-owner cannot withdraw", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("10"),
      });

      await viem.assertions.revertWithCustomError(
        warChest.write.withdraw({ account: donor1.account }),
        warChest,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Withdraw emits Withdrawn event with correct amount", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("5"),
      });

      const hash = await warChest.write.withdraw();

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await warChest.getEvents.Withdrawn();

      const {
        args: { amount },
      } = events[0];

      assert.equal(events.length, 1);
      assert.equal(amount, parseEther("5"));
    });

    it("Can donate again after withdrawal", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("5"),
      });

      await warChest.write.withdraw();

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("3"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("3"));
    });

    it("Revert when withdrawing with zero balance", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        warChest.write.withdraw(),
        warChest,
        Error.NothingToWithdraw,
      );
    });
  });

  describe("Pause", async () => {
    it("paused() is false initially", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const paused = await warChest.read.paused();

      assert.equal(paused, false);
    });

    it("Owner can pause", async () => {
      const { warChest, owner } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });

      const paused = await warChest.read.paused();

      assert.equal(paused, true);
    });

    it("Non-owner cannot pause", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        warChest.write.pause({ account: donor1.account }),
        warChest,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("donate() reverts when paused", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });

      await viem.assertions.revertWithCustomError(
        warChest.write.donate({
          account: donor1.account,
          value: parseEther("1"),
        }),
        warChest,
        Error.EnforcedPause,
      );
    });

    it("Direct ETH transfer reverts when paused", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });

      await viem.assertions.revertWithCustomError(
        donor1.sendTransaction({
          to: warChest.address,
          value: parseEther("1"),
        }),
        warChest,
        Error.EnforcedPause,
      );
    });

    it("Owner can unpause", async () => {
      const { warChest, owner } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });
      await warChest.write.unpause({ account: owner.account });

      const paused = await warChest.read.paused();

      assert.equal(paused, false);
    });

    it("Non-owner cannot unpause", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });

      await viem.assertions.revertWithCustomError(
        warChest.write.unpause({ account: donor1.account }),
        warChest,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Donations work again after unpause", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.pause({ account: owner.account });
      await warChest.write.unpause({ account: owner.account });

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("1"));
    });

    it("withdraw() succeeds even while paused", async () => {
      const { warChest, owner, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await warChest.write.pause({ account: owner.account });

      await warChest.write.withdraw({ account: owner.account });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, 0n);
    });
  });
});
