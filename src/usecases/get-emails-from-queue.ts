import { MailerContract } from "@/adapters/contracts/mailer";
import { QueueContract } from "@/adapters/contracts/queue";
import { MalaDiretaRepository } from "@/data/contracts/mala-direta-repository";
import { MalaDiretaTemplateRepository } from "@/data/contracts/mala-direta-template-repository";
import { SendEmail } from "./send-email";

export class GetEmailsFromQueue {
  constructor(
    private queueName: string,
    private queue: QueueContract,
    private maladiretaRepository: MalaDiretaRepository,
    private templateRepository: MalaDiretaTemplateRepository,
    private mailer: MailerContract
  ) { }

  async execute() {
    let quantidadeTotalDadosFila = await this.queue.count(this.queueName);
    let sendEmailUseCase = new SendEmail(this.maladiretaRepository, this.templateRepository, this.mailer);
    while(quantidadeTotalDadosFila > 0) {
      let emailsFila = await this.queue.get(this.queueName, 20);
      await sendEmailUseCase.execute(emailsFila);
      quantidadeTotalDadosFila = await this.queue.count(this.queueName);
    }
  }
}