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

    it("Initial currentEpoch is 0", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const currentEpoch = await warChest.read.currentEpoch();

      assert.equal(currentEpoch, 0n);
    });

    it("Initial totalDonated is 0", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const total = await warChest.read.totalDonated();

      assert.equal(total, 0n);
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

      const total = await warChest.read.totalDonated();

      assert.equal(total, parseEther("1"));
    });

    it("Anyone can transfer", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      const total = await warChest.read.totalDonated();

      assert.equal(total, parseEther("1"));
    });

    it("Donations update epochTotals", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const epochTotal = await warChest.read.epochTotals([0n]);

      assert.equal(epochTotal, parseEther("1"));
    });

    it("Transfers update epochTotals", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      const epochTotal = await warChest.read.epochTotals([0n]);

      assert.equal(epochTotal, parseEther("1"));
    });

    it("Donations update totalDonated", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const total = await warChest.read.totalDonated();

      assert.equal(total, parseEther("1"));
    });

    it("Transfers update totalDonated", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      const total = await warChest.read.totalDonated();

      assert.equal(total, parseEther("1"));
    });

    it("Multiple donations from the same address accumulate", async () => {
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

      const [donor1EpochTotal, total] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1EpochTotal, parseEther("3"));
      assert.equal(total, parseEther("3"));
    });

    it("Multiple transfers from the same address accumulate", async () => {
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

      const [donor1EpochTotal, total] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1EpochTotal, parseEther("3"));
      assert.equal(total, parseEther("3"));
    });

    it("Multiple donors can donate in the same epoch", async () => {
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

      const [
        donor1EpochTotal,
        donor2EpochTotal,
        donor3EpochTotal,
        epochTotal,
        total,
      ] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.donations([0n, donor2.account.address]),
        warChest.read.donations([0n, donor3.account.address]),
        warChest.read.epochTotals([0n]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1EpochTotal, parseEther("1"));
      assert.equal(donor2EpochTotal, parseEther("2"));
      assert.equal(donor3EpochTotal, parseEther("3"));
      assert.equal(epochTotal, parseEther("6"));
      assert.equal(total, parseEther("6"));
    });

    it("Multiple donors can transfer in the same epoch", async () => {
      const { warChest, donor1, donor2, donor3 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("1"),
      });

      await donor2.sendTransaction({
        to: warChest.address,
        value: parseEther("2"),
      });

      await donor3.sendTransaction({
        to: warChest.address,
        value: parseEther("3"),
      });

      const [
        donor1EpochTotal,
        donor2EpochTotal,
        donor3EpochTotal,
        epochTotal,
        total,
      ] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.donations([0n, donor2.account.address]),
        warChest.read.donations([0n, donor3.account.address]),
        warChest.read.epochTotals([0n]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1EpochTotal, parseEther("1"));
      assert.equal(donor2EpochTotal, parseEther("2"));
      assert.equal(donor3EpochTotal, parseEther("3"));
      assert.equal(epochTotal, parseEther("6"));
      assert.equal(total, parseEther("6"));
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
      assert.equal(epoch, 0n);
      assert.equal(amount, parseEther("1"));
    });

    it("Emits Donated event with correct args when transfering", async () => {
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
      assert.equal(epoch, 0n);
      assert.equal(amount, parseEther("1"));
    });

    it("Contract balance increases with donations", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("5"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("5"));
    });

    it("Contract balance increases with transfers", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await donor1.sendTransaction({
        to: warChest.address,
        value: parseEther("5"),
      });

      const balance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(balance, parseEther("5"));
    });

    it("Revert when donation is below MIN_DONATION", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

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
    it("Donations in different epochs are tracked separately", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("2"),
      });

      const [
        donor1Epoch0Total,
        donor1Epoch1Total,
        epoch0Total,
        epoch1Total,
        total,
      ] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.donations([1n, donor1.account.address]),
        warChest.read.epochTotals([0n]),
        warChest.read.epochTotals([1n]),
        warChest.read.totalDonated(),
        parseEther("3"),
      ]);

      assert.equal(donor1Epoch0Total, parseEther("1"));
      assert.equal(donor1Epoch1Total, parseEther("2"));
      assert.equal(epoch0Total, parseEther("1"));
      assert.equal(epoch1Total, parseEther("2"));
      assert.equal(total, parseEther("3"));
    });

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
      assert.equal(epoch, 2n);
    });

    it("Multiple donors across multiple epochs", async () => {
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

      const [
        donor1Epoch0Total,
        donor2Epoch0Total,
        donor2Epoch1Total,
        donor1Epoch2Total,
        donor2Epoch2Total,
        epoch0Total,
        epoch1Total,
        epoch2Total,
        total,
      ] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.donations([0n, donor2.account.address]),
        warChest.read.donations([1n, donor2.account.address]),
        warChest.read.donations([2n, donor1.account.address]),
        warChest.read.donations([2n, donor2.account.address]),
        warChest.read.epochTotals([0n]),
        warChest.read.epochTotals([1n]),
        warChest.read.epochTotals([2n]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1Epoch0Total, parseEther("1"));
      assert.equal(donor2Epoch0Total, 0n);
      assert.equal(donor2Epoch1Total, parseEther("5"));
      assert.equal(donor1Epoch2Total, parseEther("3"));
      assert.equal(donor2Epoch2Total, parseEther("4"));
      assert.equal(epoch0Total, parseEther("1"));
      assert.equal(epoch1Total, parseEther("5"));
      assert.equal(epoch2Total, parseEther("7"));
      assert.equal(total, parseEther("13"));
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

    it("totalDonated is not affected by withdrawal", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("10"),
      });

      await warChest.write.withdraw();

      const [total, balance] = await Promise.all([
        warChest.read.totalDonated(),
        publicClient.getBalance({
          address: warChest.address,
        }),
      ]);

      assert.equal(total, parseEther("10"));
      assert.equal(balance, 0n);
    });

    it("Per-epoch donation data persists after withdrawal", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("10"),
      });

      await warChest.write.withdraw();

      const [donor1Epoch0Total, epoch0Total] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.epochTotals([0n]),
      ]);

      assert.equal(donor1Epoch0Total, parseEther("10"));
      assert.equal(epoch0Total, parseEther("10"));
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

      const [donor1EpochTotal, total] = await Promise.all([
        warChest.read.donations([0n, donor1.account.address]),
        warChest.read.totalDonated(),
      ]);

      assert.equal(donor1EpochTotal, parseEther("8"));
      assert.equal(total, parseEther("8"));

      const contractBalance = await publicClient.getBalance({
        address: warChest.address,
      });

      assert.equal(contractBalance, parseEther("3"));
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

  describe("Donor and donation counts", async () => {
    it("Initial counts are 0", async () => {
      const { warChest } = await networkHelpers.loadFixture(deployFixture);

      const [donors, donations, epochDonors, epochDonations] =
        await Promise.all([
          warChest.read.totalDonors(),
          warChest.read.totalDonations(),
          warChest.read.epochDonorCount([0n]),
          warChest.read.epochDonationCount([0n]),
        ]);

      assert.equal(donors, 0n);
      assert.equal(donations, 0n);
      assert.equal(epochDonors, 0n);
      assert.equal(epochDonations, 0n);
    });

    it("Single donor increments all counts by 1", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const [donors, donations, epochDonors, epochDonations] =
        await Promise.all([
          warChest.read.totalDonors(),
          warChest.read.totalDonations(),
          warChest.read.epochDonorCount([0n]),
          warChest.read.epochDonationCount([0n]),
        ]);

      assert.equal(donors, 1n);
      assert.equal(donations, 1n);
      assert.equal(epochDonors, 1n);
      assert.equal(epochDonations, 1n);
    });

    it("Same donor donating twice counts as 1 donor but 2 donations", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });
      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const [donors, donations, epochDonors, epochDonations] =
        await Promise.all([
          warChest.read.totalDonors(),
          warChest.read.totalDonations(),
          warChest.read.epochDonorCount([0n]),
          warChest.read.epochDonationCount([0n]),
        ]);

      assert.equal(donors, 1n);
      assert.equal(donations, 2n);
      assert.equal(epochDonors, 1n);
      assert.equal(epochDonations, 2n);
    });

    it("Three different donors each count once", async () => {
      const { warChest, donor1, donor2, donor3 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await warChest.write.donate({
        account: donor2.account,
        value: parseEther("1"),
      });

      await warChest.write.donate({
        account: donor3.account,
        value: parseEther("1"),
      });

      const [donors, donations, epochDonors, epochDonations] =
        await Promise.all([
          warChest.read.totalDonors(),
          warChest.read.totalDonations(),
          warChest.read.epochDonorCount([0n]),
          warChest.read.epochDonationCount([0n]),
        ]);

      assert.equal(donors, 3n);
      assert.equal(donations, 3n);
      assert.equal(epochDonors, 3n);
      assert.equal(epochDonations, 3n);
    });

    it("Donor returning in a new epoch counts again for epoch but not global", async () => {
      const { warChest, donor1 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      const [
        totalDonors,
        totalDonations,
        epoch0Donors,
        epoch1Donors,
        epoch0Donations,
        epoch1Donations,
      ] = await Promise.all([
        warChest.read.totalDonors(),
        warChest.read.totalDonations(),
        warChest.read.epochDonorCount([0n]),
        warChest.read.epochDonorCount([1n]),
        warChest.read.epochDonationCount([0n]),
        warChest.read.epochDonationCount([1n]),
      ]);

      assert.equal(totalDonors, 1n);
      assert.equal(totalDonations, 2n);
      assert.equal(epoch0Donors, 1n);
      assert.equal(epoch1Donors, 1n);
      assert.equal(epoch0Donations, 1n);
      assert.equal(epoch1Donations, 1n);
    });

    it("New donor in epoch 1 increments global donor count", async () => {
      const { warChest, donor1, donor2 } =
        await networkHelpers.loadFixture(deployFixture);

      await warChest.write.donate({
        account: donor1.account,
        value: parseEther("1"),
      });

      await networkHelpers.time.increase(networkHelpers.time.duration.days(90));

      await warChest.write.donate({
        account: donor2.account,
        value: parseEther("1"),
      });

      const [totalDonors, totalDonations, epoch0Donors, epoch1Donors] =
        await Promise.all([
          warChest.read.totalDonors(),
          warChest.read.totalDonations(),
          warChest.read.epochDonorCount([0n]),
          warChest.read.epochDonorCount([1n]),
        ]);

      assert.equal(totalDonors, 2n);
      assert.equal(totalDonations, 2n);
      assert.equal(epoch0Donors, 1n);
      assert.equal(epoch1Donors, 1n);
    });
  });
});
