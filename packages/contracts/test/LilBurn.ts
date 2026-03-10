import { HolderLeaf, WhitelistLeaf } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Address, isAddressEqual, parseEther, zeroAddress } from "viem";

describe("LilBurn", async () => {
  const { viem, networkHelpers } = await network.connect();

  const publicClient = await viem.getPublicClient();

  async function getBlockTimestamp() {
    return (await publicClient.getBlock()).timestamp;
  }

  async function deployFixture() {
    const [owner, holder1, holder2, whitelisted1, whitelisted2, publicUser] =
      await viem.getWalletClients();

    const lilBurn = await viem.deployContract("LilBurn", [
      owner.account.address,
    ]);

    const holderTree = StandardMerkleTree.of<HolderLeaf>(
      [
        [holder1.account.address, 5n],
        [holder2.account.address, 3n],
        [whitelisted1.account.address, 10n],
      ],
      ["address", "uint256"],
    );

    const whitelistTree = StandardMerkleTree.of<WhitelistLeaf>(
      [[whitelisted1.account.address], [whitelisted2.account.address]],
      ["address"],
    );

    return {
      lilBurn,
      owner,
      holder1,
      holder2,
      whitelisted1,
      whitelisted2,
      publicUser,
      holderTree,
      whitelistTree,
    };
  }

  async function setMintPhase(
    lilBurn: Awaited<ReturnType<typeof deployFixture>>["lilBurn"],
    phase: MintPhase,
  ) {
    const now = await getBlockTimestamp();

    const offsets = {
      [MintPhase.Closed]: 0n,
      [MintPhase.Holder]: 3600n,
      [MintPhase.Whitelist]: 3600n * 2n,
      [MintPhase.Public]: 3600n * 3n,
    };

    await lilBurn.write.setPhaseSchedule([
      now + offsets[MintPhase.Holder],
      now + offsets[MintPhase.Whitelist],
      now + offsets[MintPhase.Public],
    ]);

    if (phase !== MintPhase.Closed) {
      await networkHelpers.time.increase(offsets[phase]);
    }
  }

  async function ownerMint(
    lilBurn: Awaited<ReturnType<typeof deployFixture>>["lilBurn"],
  ) {
    const [ownerClient] = await viem.getWalletClients();

    await lilBurn.write.ownerMint([ownerClient.account.address, 8n]);
  }

  function getHolderProof(
    tree: StandardMerkleTree<HolderLeaf>,
    address: Address,
    quantity: bigint,
  ) {
    return tree.getProof([address, quantity]) as Address[];
  }

  function getWhitelistProof(
    tree: StandardMerkleTree<WhitelistLeaf>,
    address: Address,
  ) {
    return tree.getProof([address]) as Address[];
  }

  const MINT_PRICE = parseEther("2");

  enum MintPhase {
    Closed = 0,
    Holder = 1,
    Whitelist = 2,
    Public = 3,
  }

  enum Error {
    OwnableUnauthorizedAccount = "OwnableUnauthorizedAccount",
    MerkleRootNotSet = "MerkleRootNotSet",
    InvalidMerkleProof = "InvalidMerkleProof",
    MintPhaseNotActive = "MintPhaseNotActive",
    ZeroQuantity = "ZeroQuantity",
    ExceedsMaxMint = "ExceedsMaxMint",
    IncorrectPayment = "IncorrectPayment",
    ExceedsMaxSupply = "ExceedsMaxSupply",
    ERC721NonexistentToken = "ERC721NonexistentToken",
    ERC721InvalidReceiver = "ERC721InvalidReceiver",
    NotOwnerOrApproved = "NotOwnerOrApproved",
    InvalidPhaseSchedule = "InvalidPhaseSchedule",
    OwnerMintNotComplete = "OwnerMintNotComplete",
    ExceedsOwnerMint = "ExceedsOwnerMint",
  }

  describe("Constants and initial state", async () => {
    it("MAX_SUPPLY is 1000", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const maxSupply = await lilBurn.read.MAX_SUPPLY();

      assert.equal(maxSupply, 1000n);
    });

    it("MINT_PRICE is 2 ether", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const mintPrice = await lilBurn.read.MINT_PRICE();

      assert.equal(mintPrice, MINT_PRICE);
    });

    it("MAX_WHITELIST_MINT is 2", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const maxWhitelistMint = await lilBurn.read.MAX_WHITELIST_MINT();

      assert.equal(maxWhitelistMint, 2n);
    });

    it("MAX_OWNER_MINT is 8", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const maxOwnerMint = await lilBurn.read.MAX_OWNER_MINT();

      assert.equal(maxOwnerMint, 8n);
    });

    it("BURN_MILESTONE_INTERVAL is 50", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const burnMilestoneInterval =
        await lilBurn.read.BURN_MILESTONE_INTERVAL();

      assert.equal(burnMilestoneInterval, 50n);
    });

    it("Initial mint phase is Closed", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const mintPhase = await lilBurn.read.mintPhase();

      assert.equal(mintPhase, MintPhase.Closed);
    });

    it("Initial totalSupply is 0", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 0n);
    });

    it("Initial burn count is 0", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const burnCount = await lilBurn.read.burnCount();

      assert.equal(burnCount, 0n);
    });

    it("Initial ownerMintCount is 0", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const ownerMintCount = await lilBurn.read.ownerMintCount();

      assert.equal(ownerMintCount, 0n);
    });

    it("Initial phase timestamps are 0", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const [holderStart, whitelistStart, publicStart] = await Promise.all([
        lilBurn.read.holderStart(),
        lilBurn.read.whitelistStart(),
        lilBurn.read.publicStart(),
      ]);

      assert.equal(holderStart, 0n);
      assert.equal(whitelistStart, 0n);
      assert.equal(publicStart, 0n);
    });

    it("Initial paused is false", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const paused = await lilBurn.read.paused();

      assert.equal(paused, false);
    });
  });

  describe("Owner functions", async () => {
    it("Owner can set phase schedule", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      const holderStart = now + 3600n;
      const whitelistStart = now + 3600n * 2n;
      const publicStart = now + 3600n * 3n;

      await lilBurn.write.setPhaseSchedule([
        holderStart,
        whitelistStart,
        publicStart,
      ]);

      const [actualHolderStart, actualWhitelistStart, actualPublicStart] =
        await Promise.all([
          lilBurn.read.holderStart(),
          lilBurn.read.whitelistStart(),
          lilBurn.read.publicStart(),
        ]);

      assert.equal(actualHolderStart, holderStart);
      assert.equal(actualWhitelistStart, whitelistStart);
      assert.equal(actualPublicStart, publicStart);
    });

    it("Non-owner cannot set phase schedule", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([0n, 0n, 0n], {
          account: holder1.account,
        }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Emits PhaseScheduleSet when schedule changes", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      const holderStart = now + 3600n;
      const whitelistStart = now + 3600n * 2n;
      const publicStart = now + 3600n * 3n;

      const hash = await lilBurn.write.setPhaseSchedule([
        holderStart,
        whitelistStart,
        publicStart,
      ]);

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.PhaseScheduleSet();

      assert.equal(events.length, 1);

      assert.deepEqual(events[0].args, {
        holderStart,
        whitelistStart,
        publicStart,
      });
    });

    it("Phase transitions automatically between phases", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      const offset = 100n;

      await lilBurn.write.setPhaseSchedule([
        now + offset,
        now + offset * 2n,
        now + offset * 3n,
      ]);

      const phaseClosed = await lilBurn.read.mintPhase();

      assert.equal(phaseClosed, MintPhase.Closed);

      await networkHelpers.time.increase(offset);

      const phaseHolder = await lilBurn.read.mintPhase();

      assert.equal(phaseHolder, MintPhase.Holder);

      await networkHelpers.time.increase(offset);

      const phaseWhitelist = await lilBurn.read.mintPhase();

      assert.equal(phaseWhitelist, MintPhase.Whitelist);

      await networkHelpers.time.increase(offset);

      const phasePublic = await lilBurn.read.mintPhase();

      assert.equal(phasePublic, MintPhase.Public);
    });

    it("Revert when whitelistStart < holderStart", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([now + 200n, now + 100n, now + 300n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Revert when publicStart < whitelistStart", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([now + 100n, now + 300n, now + 200n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Revert when holderStart is 0 but whitelistStart is nonzero", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([0n, now + 100n, now + 200n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Revert when whitelistStart is 0 but publicStart is nonzero", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([now + 100n, 0n, now + 200n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Allows clearing schedule with all zeros", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      await setMintPhase(lilBurn, MintPhase.Public);

      const phaseBefore = await lilBurn.read.mintPhase();

      assert.equal(phaseBefore, MintPhase.Public);

      await lilBurn.write.setPhaseSchedule([0n, 0n, 0n]);

      const phaseAfter = await lilBurn.read.mintPhase();

      assert.equal(phaseAfter, MintPhase.Closed);
    });

    it("Revert when schedule is partial (holder only)", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([now + 1n, 0n, 0n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Revert when schedule is partial (holder and whitelist only)", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPhaseSchedule([now + 100n, now + 200n, 0n]),
        lilBurn,
        Error.InvalidPhaseSchedule,
      );
    });

    it("Allows equal timestamps to skip phases", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const now = await getBlockTimestamp();

      await lilBurn.write.setPhaseSchedule([now + 1n, now + 1n, now + 1n]);

      await networkHelpers.time.increase(1);

      const mintPhase = await lilBurn.read.mintPhase();

      assert.equal(mintPhase, MintPhase.Public);
    });

    it("Owner can pause", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      await setMintPhase(lilBurn, MintPhase.Public);

      const phaseBeforePause = await lilBurn.read.mintPhase();

      assert.equal(phaseBeforePause, MintPhase.Public);

      await lilBurn.write.setPaused([true]);

      const [paused, phaseWhilePaused] = await Promise.all([
        lilBurn.read.paused(),
        lilBurn.read.mintPhase(),
      ]);

      assert.equal(paused, true);
      assert.equal(phaseWhilePaused, MintPhase.Closed);
    });

    it("Owner can unpause", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.setPaused([true]);

      const phaseWhilePaused = await lilBurn.read.mintPhase();

      assert.equal(phaseWhilePaused, MintPhase.Closed);

      await lilBurn.write.setPaused([false]);

      const phaseAfterUnpause = await lilBurn.read.mintPhase();

      assert.equal(phaseAfterUnpause, MintPhase.Public);
    });

    it("Non-owner cannot pause", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setPaused([true], { account: holder1.account }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Emits MintPaused event", async () => {
      const { lilBurn } = await networkHelpers.loadFixture(deployFixture);

      const hash = await lilBurn.write.setPaused([true]);

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.MintPaused();

      assert.equal(events.length, 1);
      assert.equal(events[0].args.paused, true);
    });

    it("Owner can set holder Merkle root", async () => {
      const { lilBurn, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      const holderMerkleRoot = await lilBurn.read.holderMerkleRoot();

      assert.equal(holderMerkleRoot, holderTree.root);
    });

    it("Non-owner cannot set holder Merkle root", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setHolderMerkleRoot([holderTree.root as Address], {
          account: holder1.account,
        }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Owner can set whitelist Merkle root", async () => {
      const { lilBurn, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      const whitelistMerkleRoot = await lilBurn.read.whitelistMerkleRoot();

      assert.equal(whitelistMerkleRoot, whitelistTree.root);
    });

    it("Non-owner cannot set whitelist Merkle root", async () => {
      const { lilBurn, holder1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setWhitelistMerkleRoot([whitelistTree.root as Address], {
          account: holder1.account,
        }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Owner can set base URI", async () => {
      const { lilBurn, owner, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      assert.ok(await lilBurn.write.setBaseURI(["https://example.com"]));
    });

    it("Non-owner cannot set base URI", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.setBaseURI(["https://example.com"], {
          account: holder1.account,
        }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Owner can withdraw", async () => {
      const { lilBurn, owner, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([2n], {
        account: holder1.account,
        value: MINT_PRICE * 2n,
      });

      const ownerBalanceBefore = await publicClient.getBalance({
        address: owner.account.address,
      });

      const hash = await lilBurn.write.withdraw();

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const gas = receipt.gasUsed * receipt.effectiveGasPrice;

      const ownerBalanceAfter = await publicClient.getBalance({
        address: owner.account.address,
      });

      assert.equal(
        ownerBalanceAfter,
        ownerBalanceBefore + MINT_PRICE * 2n - gas,
      );

      const contractBalance = await publicClient.getBalance({
        address: lilBurn.address,
      });

      assert.equal(contractBalance, 0n);
    });

    it("Non-owner cannot withdraw", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.withdraw({ account: holder1.account }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Withdraw emits Withdrawn event with correct amount", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: holder1.account,
        value: MINT_PRICE,
      });

      const hash = await lilBurn.write.withdraw();

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.Withdrawn();

      assert.equal(events.length, 1);

      assert.equal(events[0].args.amount, MINT_PRICE);
    });
  });

  describe("Owner mint", async () => {
    it("Owner can mint to a specific address", async () => {
      const { lilBurn, holder1, holder2 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.ownerMint([holder1.account.address, 2n]);

      await lilBurn.write.ownerMint([holder2.account.address, 1n]);

      const [owner1, owner2, owner3, ownerMintCount, totalSupply] =
        await Promise.all([
          lilBurn.read.ownerOf([1n]),
          lilBurn.read.ownerOf([2n]),
          lilBurn.read.ownerOf([3n]),
          lilBurn.read.ownerMintCount(),
          lilBurn.read.totalSupply(),
        ]);

      assert.ok(isAddressEqual(owner1, holder1.account.address));
      assert.ok(isAddressEqual(owner2, holder1.account.address));
      assert.ok(isAddressEqual(owner3, holder2.account.address));
      assert.equal(ownerMintCount, 3n);
      assert.equal(totalSupply, 3n);
    });

    it("Owner can mint in multiple transactions up to the cap", async () => {
      const { lilBurn, holder1, holder2 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.ownerMint([holder1.account.address, 5n]);

      await lilBurn.write.ownerMint([holder2.account.address, 3n]);

      const [ownerMintCount, totalSupply] = await Promise.all([
        lilBurn.read.ownerMintCount(),
        lilBurn.read.totalSupply(),
      ]);

      assert.equal(ownerMintCount, 8n);
      assert.equal(totalSupply, 8n);
    });

    it("Token IDs start at 1 and are sequential", async () => {
      const { lilBurn, holder1, holder2 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.ownerMint([holder1.account.address, 3n]);

      await lilBurn.write.ownerMint([holder2.account.address, 2n]);

      const [owner1, owner3, owner4, owner5] = await Promise.all([
        lilBurn.read.ownerOf([1n]),
        lilBurn.read.ownerOf([3n]),
        lilBurn.read.ownerOf([4n]),
        lilBurn.read.ownerOf([5n]),
      ]);

      assert.ok(isAddressEqual(owner1, holder1.account.address));
      assert.ok(isAddressEqual(owner3, holder1.account.address));
      assert.ok(isAddressEqual(owner4, holder2.account.address));
      assert.ok(isAddressEqual(owner5, holder2.account.address));
    });

    it("ownerMintCount tracks minted tokens", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      const ownerMintCount0 = await lilBurn.read.ownerMintCount();

      assert.equal(ownerMintCount0, 0n);

      await lilBurn.write.ownerMint([holder1.account.address, 3n]);

      const ownerMintCount3 = await lilBurn.read.ownerMintCount();

      assert.equal(ownerMintCount3, 3n);

      await lilBurn.write.ownerMint([holder1.account.address, 5n]);

      const ownerMintCount8 = await lilBurn.read.ownerMintCount();

      assert.equal(ownerMintCount8, 8n);
    });

    it("Emits Minted event with correct args", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      const hash = await lilBurn.write.ownerMint([holder1.account.address, 4n]);

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.Minted();

      assert.equal(events.length, 1);

      assert.ok(
        events[0].args.to &&
          isAddressEqual(events[0].args.to, holder1.account.address),
      );

      assert.equal(events[0].args.startTokenId, 1n);

      assert.equal(events[0].args.quantity, 4n);
    });

    it("Non-owner cannot call ownerMint", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.ownerMint([holder1.account.address, 1n], {
          account: holder1.account,
        }),
        lilBurn,
        Error.OwnableUnauthorizedAccount,
      );
    });

    it("Revert when quantity is zero", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.ownerMint([holder1.account.address, 0n]),
        lilBurn,
        Error.ZeroQuantity,
      );
    });

    it("ownerMint is allowed when mint is paused", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setPaused([true]);

      await lilBurn.write.ownerMint([holder1.account.address, 3n]);

      const ownerMintCount = await lilBurn.read.ownerMintCount();

      assert.equal(ownerMintCount, 3n);
    });

    it("Revert when exceeding MAX_OWNER_MINT", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.ownerMint([holder1.account.address, 8n]);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.ownerMint([holder1.account.address, 1n]),
        lilBurn,
        Error.ExceedsOwnerMint,
      );
    });

    it("Revert when batch would exceed MAX_OWNER_MINT", async () => {
      const { lilBurn, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.ownerMint([holder1.account.address, 5n]);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.ownerMint([holder1.account.address, 4n]),
        lilBurn,
        Error.ExceedsOwnerMint,
      );
    });

    it("Revert when holder mints before owner mints are complete", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await lilBurn.write.ownerMint([holder1.account.address, 5n]);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.OwnerMintNotComplete,
      );
    });

    it("Revert when whitelist mints before owner mints are complete", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.OwnerMintNotComplete,
      );
    });

    it("Revert when public mints before owner mints are complete", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await setMintPhase(lilBurn, MintPhase.Public);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([1n], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.OwnerMintNotComplete,
      );
    });

    it("Normal mints succeed once all 8 owner mints are done", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 9n);
    });
  });

  describe("Holder mint", async () => {
    it("Holder can mint", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      const hash = await lilBurn.write.holderMint([1n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const [owner9, holderMintCount, totalSupply] = await Promise.all([
        lilBurn.read.ownerOf([9n]),
        lilBurn.read.holderMintCount([holder1.account.address]),
        lilBurn.read.totalSupply(),
      ]);

      assert.ok(isAddressEqual(owner9, holder1.account.address));
      assert.equal(holderMintCount, 1n);
      assert.equal(totalSupply, 9n);
    });

    it("Holder can mint up to their max in one transaction", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await lilBurn.write.holderMint([5n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 5n,
      });

      const holderMintCount = await lilBurn.read.holderMintCount([
        holder1.account.address,
      ]);

      assert.equal(holderMintCount, 5n);
    });

    it("Holder can mint across multiple transactions up to max", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await lilBurn.write.holderMint([2n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 2n,
      });

      await lilBurn.write.holderMint([3n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 3n,
      });

      const holderMintCount = await lilBurn.read.holderMintCount([
        holder1.account.address,
      ]);

      assert.equal(holderMintCount, 5n);
    });

    it("Holder cannot exceed their max mint", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await lilBurn.write.holderMint([5n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 5n,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.ExceedsMaxMint,
      );
    });

    it("Different holders have different max mints", async () => {
      const { lilBurn, holder1, holder2, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof1 = getHolderProof(holderTree, holder1.account.address, 5n);

      await lilBurn.write.holderMint([5n, 5n, proof1], {
        account: holder1.account,
        value: MINT_PRICE * 5n,
      });

      const proof2 = getHolderProof(holderTree, holder2.account.address, 3n);

      await lilBurn.write.holderMint([3n, 3n, proof2], {
        account: holder2.account,
        value: MINT_PRICE * 3n,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 3n, proof2], {
          account: holder2.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.ExceedsMaxMint,
      );

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 16n);
    });

    it("Revert when Merkle proof is invalid", async () => {
      const { lilBurn, holder1, publicUser, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.InvalidMerkleProof,
      );
    });

    it("Revert when maxQuantity in proof is wrong", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 100n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.InvalidMerkleProof,
      );
    });

    it("Revert when mint phase is not Holder", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.MintPhaseNotActive,
      );
    });

    it("Revert when payment is insufficient", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: parseEther("1"),
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when payment exceeds price", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: parseEther("3"),
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when Merkle root is not set", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.MerkleRootNotSet,
      );
    });

    it("Revert when quantity is zero", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([0n, 5n, proof], {
          account: holder1.account,
          value: 0n,
        }),
        lilBurn,
        Error.ZeroQuantity,
      );
    });

    it("Emits Minted event with correct args", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      const hash = await lilBurn.write.holderMint([3n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 3n,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.Minted();

      assert.equal(events.length, 1);

      assert.ok(
        events[0].args.to &&
          isAddressEqual(events[0].args.to, holder1.account.address),
      );

      assert.equal(events[0].args.startTokenId, 9n);

      assert.equal(events[0].args.quantity, 3n);
    });

    it("Revert when exceeding MAX_SUPPLY", async () => {
      const { lilBurn, holder1, holder2, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      for (let i = 0; i < 49; i++) {
        await lilBurn.write.publicMint([20n], {
          account: holder2.account,
          value: MINT_PRICE * 20n,
        });
      }

      await lilBurn.write.publicMint([12n], {
        account: holder2.account,
        value: MINT_PRICE * 12n,
      });

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([5n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE * 5n,
        }),
        lilBurn,
        Error.ExceedsMaxSupply,
      );
    });
  });

  describe("Whitelist mint", async () => {
    it("Whitelisted can mint", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await lilBurn.write.whitelistMint([1n, proof], {
        account: whitelisted1.account,
        value: MINT_PRICE,
      });

      const [owner9, whitelistMintCount, totalSupply] = await Promise.all([
        lilBurn.read.ownerOf([9n]),
        lilBurn.read.whitelistMintCount([whitelisted1.account.address]),
        lilBurn.read.totalSupply(),
      ]);

      assert.ok(isAddressEqual(owner9, whitelisted1.account.address));
      assert.equal(whitelistMintCount, 1n);
      assert.equal(totalSupply, 9n);
    });

    it("Whitelisted address can mint up to MAX_WHITELIST_MINT", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await lilBurn.write.whitelistMint([2n, proof], {
        account: whitelisted1.account,
        value: MINT_PRICE * 2n,
      });

      const whitelistMintCount = await lilBurn.read.whitelistMintCount([
        whitelisted1.account.address,
      ]);

      assert.equal(whitelistMintCount, 2n);
    });

    it("Whitelisted address cannot exceed MAX_WHITELIST_MINT", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await lilBurn.write.whitelistMint([2n, proof], {
        account: whitelisted1.account,
        value: MINT_PRICE * 2n,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.ExceedsMaxMint,
      );
    });

    it("Revert when exceeding MAX_SUPPLY", async () => {
      const { lilBurn, whitelisted1, whitelisted2, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      // Fill the remaining 992 slots (1000 - 8 owner mints) in batches of 20
      for (let i = 0; i < 49; i++) {
        await lilBurn.write.publicMint([20n], {
          account: whitelisted2.account,
          value: MINT_PRICE * 20n,
        });
      }
      await lilBurn.write.publicMint([12n], {
        account: whitelisted2.account,
        value: MINT_PRICE * 12n,
      });

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([2n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE * 2n,
        }),
        lilBurn,
        Error.ExceedsMaxSupply,
      );
    });

    it("Revert when Merkle proof is invalid", async () => {
      const { lilBurn, whitelisted1, publicUser, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.InvalidMerkleProof,
      );
    });

    it("Revert when phase is not Whitelist", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.MintPhaseNotActive,
      );
    });

    it("Revert when payment is insufficient", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: parseEther("1"),
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when payment exceeds price", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = await getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE * 2n,
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when quantity is zero", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([0n, proof], {
          account: whitelisted1.account,
          value: 0n,
        }),
        lilBurn,
        Error.ZeroQuantity,
      );
    });

    it("Revert when Merkle root is not set", async () => {
      const { lilBurn, whitelisted1, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Whitelist);

      const proof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await viem.assertions.revertWithCustomError(
        lilBurn.write.whitelistMint([1n, proof], {
          account: whitelisted1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.MerkleRootNotSet,
      );
    });
  });

  describe("Public mint", async () => {
    it("Anyone can mint", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      const [owner9, totalSupply] = await Promise.all([
        lilBurn.read.ownerOf([9n]),
        lilBurn.read.totalSupply(),
      ]);

      assert.ok(isAddressEqual(owner9, publicUser.account.address));
      assert.equal(totalSupply, 9n);
    });

    it("Can mint multiple in one transaction", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([5n], {
        account: publicUser.account,
        value: MINT_PRICE * 5n,
      });

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 13n);
    });

    it("No per-address limit", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([10n], {
        account: publicUser.account,
        value: MINT_PRICE * 10n,
      });

      await lilBurn.write.publicMint([10n], {
        account: publicUser.account,
        value: MINT_PRICE * 10n,
      });

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 28n);
    });

    it("Revert when phase is not Public", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([1n], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.MintPhaseNotActive,
      );
    });

    it("Revert when payment is insufficient", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([2n], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when payment exceeds price", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([1n], {
          account: publicUser.account,
          value: MINT_PRICE * 2n,
        }),
        lilBurn,
        Error.IncorrectPayment,
      );
    });

    it("Revert when quantity is zero", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([0n], {
          account: publicUser.account,
          value: 0n,
        }),
        lilBurn,
        Error.ZeroQuantity,
      );
    });

    it("Revert when quantity exceeds MAX_PUBLIC_MINT", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      const quantity = 21n;

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([quantity], {
          account: publicUser.account,
          value: MINT_PRICE * quantity,
        }),
        lilBurn,
        Error.ExceedsMaxMint,
      );
    });

    it("Can mint exactly MAX_PUBLIC_MINT in one request", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      const quantity = 20n;

      await lilBurn.write.publicMint([quantity], {
        account: publicUser.account,
        value: MINT_PRICE * quantity,
      });

      const balance = await lilBurn.read.balanceOf([
        publicUser.account.address,
      ]);

      assert.equal(balance, quantity);
    });

    it("Revert when exceeding MAX_SUPPLY", async () => {
      const { lilBurn, whitelisted1, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      // Fill the remaining 992 slots (1000 - 8 owner mints) in batches of 20
      for (let i = 0; i < 49; i++) {
        await lilBurn.write.publicMint([20n], {
          account: whitelisted1.account,
          value: MINT_PRICE * 20n,
        });
      }
      await lilBurn.write.publicMint([12n], {
        account: whitelisted1.account,
        value: MINT_PRICE * 12n,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([2n], {
          account: publicUser.account,
          value: MINT_PRICE * 2n,
        }),
        lilBurn,
        Error.ExceedsMaxSupply,
      );
    });
  });

  describe("Cross-phase behavior", async () => {
    it("Address that are Holder and Whitelisted can mint in both phases", async () => {
      const { lilBurn, whitelisted1, holderTree, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      const now = await getBlockTimestamp();
      await lilBurn.write.setPhaseSchedule([
        BigInt(now) + 10n,
        BigInt(now) + 1000n,
        BigInt(now) + 2000n,
      ]);

      await networkHelpers.time.increase(10);

      const holderProof = getHolderProof(
        holderTree,
        whitelisted1.account.address,
        10n,
      );

      await lilBurn.write.holderMint([10n, 10n, holderProof], {
        account: whitelisted1.account,
        value: MINT_PRICE * 10n,
      });

      await networkHelpers.time.increase(990);

      const whitelistProof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await lilBurn.write.whitelistMint([2n, whitelistProof], {
        account: whitelisted1.account,
        value: MINT_PRICE * 2n,
      });

      const [holderMintCount, whitelistMintCount, totalSupply] =
        await Promise.all([
          lilBurn.read.holderMintCount([whitelisted1.account.address]),
          lilBurn.read.whitelistMintCount([whitelisted1.account.address]),
          lilBurn.read.totalSupply(),
        ]);

      assert.equal(holderMintCount, 10n);
      assert.equal(whitelistMintCount, 2n);
      assert.equal(totalSupply, 20n);
    });

    it("Holder mint count persists across phase changes", async () => {
      const { lilBurn, holder1, holderTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Holder);

      const proof = getHolderProof(holderTree, holder1.account.address, 5n);

      await lilBurn.write.holderMint([3n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 3n,
      });

      const holderMintCount3 = await lilBurn.read.holderMintCount([
        holder1.account.address,
      ]);

      assert.equal(holderMintCount3, 3n);

      await setMintPhase(lilBurn, MintPhase.Holder);

      await lilBurn.write.holderMint([2n, 5n, proof], {
        account: holder1.account,
        value: MINT_PRICE * 2n,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.holderMint([1n, 5n, proof], {
          account: holder1.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.ExceedsMaxMint,
      );
    });

    it("Token IDs are sequential across phases", async () => {
      const { lilBurn, holder1, whitelisted1, holderTree, whitelistTree } =
        await networkHelpers.loadFixture(deployFixture);

      await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

      await lilBurn.write.setWhitelistMerkleRoot([
        whitelistTree.root as Address,
      ]);

      await ownerMint(lilBurn);

      const now = await getBlockTimestamp();
      await lilBurn.write.setPhaseSchedule([
        BigInt(now) + 10n,
        BigInt(now) + 1000n,
        BigInt(now) + 2000n,
      ]);

      await networkHelpers.time.increase(10);

      const holderProof = getHolderProof(
        holderTree,
        holder1.account.address,
        5n,
      );

      await lilBurn.write.holderMint([2n, 5n, holderProof], {
        account: holder1.account,
        value: MINT_PRICE * 2n,
      });

      await networkHelpers.time.increase(990);

      const whitelistProof = getWhitelistProof(
        whitelistTree,
        whitelisted1.account.address,
      );

      await lilBurn.write.whitelistMint([2n, whitelistProof], {
        account: whitelisted1.account,
        value: MINT_PRICE * 2n,
      });

      const [owner9, owner10, owner11, owner12] = await Promise.all([
        lilBurn.read.ownerOf([9n]),
        lilBurn.read.ownerOf([10n]),
        lilBurn.read.ownerOf([11n]),
        lilBurn.read.ownerOf([12n]),
      ]);

      assert.ok(isAddressEqual(owner9, holder1.account.address));
      assert.ok(isAddressEqual(owner10, holder1.account.address));
      assert.ok(isAddressEqual(owner11, whitelisted1.account.address));
      assert.ok(isAddressEqual(owner12, whitelisted1.account.address));
    });

    it("Supply is shared across all phases", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      // Mint the remaining 992 nfts (1000 - 8 owner mints) in batches of 20
      for (let i = 0; i < 49; i++) {
        await lilBurn.write.publicMint([20n], {
          account: publicUser.account,
          value: MINT_PRICE * 20n,
        });
      }
      await lilBurn.write.publicMint([12n], {
        account: publicUser.account,
        value: MINT_PRICE * 12n,
      });

      const totalSupply = await lilBurn.read.totalSupply();

      assert.equal(totalSupply, 1000n);

      await viem.assertions.revertWithCustomError(
        lilBurn.write.publicMint([1n], {
          account: publicUser.account,
          value: MINT_PRICE,
        }),
        lilBurn,
        Error.ExceedsMaxSupply,
      );
    });
  });

  describe("Burn", async () => {
    it("Owner can burn their NFTs", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await lilBurn.write.burn([9n], { account: publicUser.account });

      await viem.assertions.revertWithCustomError(
        lilBurn.read.ownerOf([9n]),
        lilBurn,
        Error.ERC721NonexistentToken,
      );

      const burnCount = await lilBurn.read.burnCount();

      assert.equal(burnCount, 1n);
    });

    it("Approved address can burn", async () => {
      const { lilBurn, publicUser, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await lilBurn.write.approve([holder1.account.address, 9n], {
        account: publicUser.account,
      });

      await lilBurn.write.burn([9n], { account: holder1.account });

      await viem.assertions.revertWithCustomError(
        lilBurn.read.ownerOf([9n]),
        lilBurn,
        Error.ERC721NonexistentToken,
      );

      const burnCount = await lilBurn.read.burnCount();

      assert.equal(burnCount, 1n);
    });

    it("Operator (approvedForAll) can burn", async () => {
      const { lilBurn, publicUser, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await lilBurn.write.setApprovalForAll([holder1.account.address, true], {
        account: publicUser.account,
      });

      await lilBurn.write.burn([9n], { account: holder1.account });

      await viem.assertions.revertWithCustomError(
        lilBurn.read.ownerOf([9n]),
        lilBurn,
        Error.ERC721NonexistentToken,
      );
    });

    it("Non-owner cannot burn", async () => {
      const { lilBurn, publicUser, holder1 } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.burn([9n], { account: holder1.account }),
        lilBurn,
        Error.NotOwnerOrApproved,
      );
    });

    it("Transfer to address(0) reverts", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.transferFrom(
          [publicUser.account.address, zeroAddress, 9n],
          { account: publicUser.account },
        ),
        lilBurn,
        Error.ERC721InvalidReceiver,
      );
    });

    it("burnCount increments with each burn", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([3n], {
        account: publicUser.account,
        value: MINT_PRICE * 3n,
      });

      const burnCount0 = await lilBurn.read.burnCount();

      assert.equal(burnCount0, 0n);

      await lilBurn.write.burn([9n], { account: publicUser.account });

      const burnCount1 = await lilBurn.read.burnCount();

      assert.equal(burnCount1, 1n);

      await lilBurn.write.burn([10n], { account: publicUser.account });

      const burnCount2 = await lilBurn.read.burnCount();

      assert.equal(burnCount2, 2n);

      await lilBurn.write.burn([11n], { account: publicUser.account });

      const burnCount3 = await lilBurn.read.burnCount();

      assert.equal(burnCount3, 3n);
    });

    it("Burning emits Transfer event to address(0)", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      const hash = await lilBurn.write.burn([9n], {
        account: publicUser.account,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await lilBurn.getEvents.Transfer();

      const burnEvent = events.find(
        ({ args: { to } }) => to && isAddressEqual(to, zeroAddress),
      );

      assert.ok(burnEvent);

      assert.equal(burnEvent.args.tokenId, 9n);

      assert.ok(
        burnEvent.args.from &&
          isAddressEqual(burnEvent.args.from, publicUser.account.address),
      );
    });

    it("totalSupply decreases after burn", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([3n], {
        account: publicUser.account,
        value: MINT_PRICE * 3n,
      });

      const totalSupply11 = await lilBurn.read.totalSupply();

      assert.equal(totalSupply11, 11n);

      await lilBurn.write.burn([9n], { account: publicUser.account });

      const totalSupply10 = await lilBurn.read.totalSupply();

      assert.equal(totalSupply10, 10n);

      await lilBurn.write.burn([10n], { account: publicUser.account });

      const totalSupply9 = await lilBurn.read.totalSupply();

      assert.equal(totalSupply9, 9n);

      await lilBurn.write.burn([11n], { account: publicUser.account });

      const totalSupply8 = await lilBurn.read.totalSupply();

      assert.equal(totalSupply8, 8n);
    });

    it("Cannot burn the same token twice", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await lilBurn.write.burn([9n], { account: publicUser.account });

      await viem.assertions.revertWithCustomError(
        lilBurn.write.burn([9n], { account: publicUser.account }),
        lilBurn,
        Error.ERC721NonexistentToken,
      );
    });

    it("BurnMilestone is not emitted before BURN_MILESTONE_INTERVAL burns", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      await lilBurn.write.publicMint([1n], {
        account: publicUser.account,
        value: MINT_PRICE,
      });

      await lilBurn.write.burn([9n], { account: publicUser.account });

      const milestoneEvents = await lilBurn.getEvents.BurnMilestone();

      assert.equal(milestoneEvents.length, 0);
    });

    it("BurnMilestone(1) is emitted on the first milestone burn", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      const interval = await lilBurn.read.BURN_MILESTONE_INTERVAL();

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      // Mint at least the interval in batches since public mint is 20 max
      const batches = Math.ceil(Number(interval) / 20);

      for (let i = 0; i < batches; ++i) {
        await lilBurn.write.publicMint([20n], {
          account: publicUser.account,
          value: MINT_PRICE * 20n,
        });
      }

      // Ignore owner mints
      const firstId = 9n;
      const lastId = firstId + interval - 1n;

      for (let id = firstId; id < lastId; id++) {
        await lilBurn.write.burn([id], { account: publicUser.account });
      }

      await lilBurn.write.burn([lastId], { account: publicUser.account });

      const milestoneEvents = await lilBurn.getEvents.BurnMilestone();

      assert.equal(milestoneEvents.length, 1);
      assert.equal(milestoneEvents[0].args.milestone, 1n);
    });

    it("BurnMilestone(2) is emitted on the second milestone burn", async () => {
      const { lilBurn, publicUser } =
        await networkHelpers.loadFixture(deployFixture);

      const interval = await lilBurn.read.BURN_MILESTONE_INTERVAL();
      const total = interval * 2n;

      await ownerMint(lilBurn);

      await setMintPhase(lilBurn, MintPhase.Public);

      const batches = Math.ceil(Number(total) / 20);

      for (let i = 0; i < batches; ++i) {
        await lilBurn.write.publicMint([20n], {
          account: publicUser.account,
          value: MINT_PRICE * 20n,
        });
      }

      const firstId = 9n;
      const lastId = firstId + total - 1n;

      for (let id = firstId; id < lastId; id++) {
        await lilBurn.write.burn([id], { account: publicUser.account });
      }

      await lilBurn.write.burn([lastId], { account: publicUser.account });

      const milestoneEvents = await lilBurn.getEvents.BurnMilestone();

      assert.equal(milestoneEvents.length, 1);
      assert.equal(milestoneEvents[0].args.milestone, 2n);
    });
  });
});
