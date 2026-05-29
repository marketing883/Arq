declare module "@mailchimp/mailchimp_marketing" {
  interface Config {
    apiKey: string;
    server: string;
  }

  interface ListMemberData {
    email_address: string;
    status: string;
    merge_fields?: Record<string, string>;
    tags?: string[];
  }

  interface UpdateMemberData {
    merge_fields?: Record<string, string>;
    status?: string;
    tags?: string[];
  }

  interface TagsData {
    tags: Array<{ name: string; status: string }>;
  }

  interface Lists {
    addListMember(listId: string, data: ListMemberData): Promise<unknown>;
    getListMember(listId: string, subscriberHash: string): Promise<unknown>;
    updateListMember(listId: string, subscriberHash: string, data: UpdateMemberData): Promise<unknown>;
    updateListMemberTags(listId: string, subscriberHash: string, data: TagsData): Promise<unknown>;
  }

  interface Mailchimp {
    setConfig(config: Config): void;
    lists: Lists;
  }

  const mailchimp: Mailchimp;
  export default mailchimp;
}
