import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PracticeModule } from './practice/practice.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { YearModule } from './year/year.module';
import { YearTopicModule } from './year-topic/year-topic.module';

describe('Backend module classes', () => {
  it('should define application modules', () => {
    expect(AppModule).toBeDefined();
    expect(AuthModule).toBeDefined();
    expect(HealthModule).toBeDefined();
    expect(PracticeModule).toBeDefined();
    expect(TopicModule).toBeDefined();
    expect(UserModule).toBeDefined();
    expect(YearModule).toBeDefined();
    expect(YearTopicModule).toBeDefined();
  });
});
