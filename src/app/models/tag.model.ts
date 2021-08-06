export class Tag {
  id: number;
  name: string;
  description: string;
  enabled: boolean;

  constructor(id: number, name: string, description: string, isEnabled: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = isEnabled;
  }
}
