import { expect } from 'chai';
import { Replacement, RuleFailure } from 'tslint';
import { ruleMessage, ruleName } from '../src/ionTabBadgeIsNowBadgeRule';
import { assertAnnotated, assertFailure, assertSuccess } from './testHelper';

describe(ruleName, () => {
  describe('success', () => {
    it('should work with proper style', () => {
      let source = `
          @Component({
            template: \`  <ion-tab badge="sdfg"></ion-tab>  \`
          })
          class Bar {}
        `;
      assertSuccess(ruleName, source);
    });
  });

  describe('failure', () => {
    it('should fail when tabBadge is passed in', () => {
      let source = `
            @Component({
              template: \`<ion-tab tabBadge="sdfg"></ion-tab>
                                   ~~~~~~~~             
              \`
            })
            class Bar {}
          `;

      assertAnnotated({
        ruleName,
        message: ruleMessage,
        source
      });
    });

    it('should fail when tabBadge is passed in', () => {
      let source = `
            @Component({
              template: \`<ion-tab tabBadge="sdfg">
                                   ~~~~~~~~
                          </ion-tab>
              \`
            })
            class Bar {}
          `;

      assertAnnotated({
        ruleName,
        message: ruleMessage,
        source
      });
    });
  });

  describe('replacements', () => {
    it('should replace tabBadge with badge', () => {
      let source = `
        @Component({
          template: \`<ion-tab tabBadge="sdfg"></ion-tab>
          \`
        })
        class Bar {}
      `;

      const fail = {
        message: ruleMessage,
        startPosition: {
          line: 2,
          character: 31
        },
        endPosition: {
          line: 2,
          character: 39
        }
      };

      const failures: RuleFailure[] = assertFailure(ruleName, source, fail);

      const fixes: Replacement[] = failures[0].getFix() as any;

      const res = Replacement.applyAll(source, fixes);

      let expected = `
        @Component({
          template: \`<ion-tab badge="sdfg"></ion-tab>
          \`
        })
        class Bar {}
      `;

      expect(res).to.eq(expected);
    });

    it('should replace tabBadge with badge', () => {
      let source = `
        @Component({
          template: \`
          <ion-tab tabBadge="sdfg">
          </ion-tab>
          \`
        })
        class Bar {}
      `;

      const fail = {
        message: ruleMessage,
        startPosition: {
          line: 3,
          character: 20
        },
        endPosition: {
          line: 3,
          character: 28
        }
      };

      const failures: RuleFailure[] = assertFailure(ruleName, source, fail);

      const fixes: Replacement[] = failures[0].getFix() as any;

      const res = Replacement.applyAll(source, fixes);

      let expected = `
        @Component({
          template: \`
          <ion-tab badge="sdfg">
          </ion-tab>
          \`
        })
        class Bar {}
      `;

      expect(res).to.eq(expected);
    });
  });
});
